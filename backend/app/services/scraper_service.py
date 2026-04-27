from __future__ import annotations

import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List
from uuid import uuid4

import requests
from sqlalchemy.orm import Session

from ..models import ImageRow
from ..services.storage_service import ensure_storage_dirs, save_bytes_to_uploads
from ..settings import get_gemini_api_key, get_google_cse_api_key, get_google_cse_id

log = logging.getLogger(__name__)

_TIMEOUT = 10
_MAX_RESULTS = 10


def _extract_keywords_gemini(image_path: str) -> str | None:
    api_key = get_gemini_api_key()
    if not api_key:
        return None

    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()

        suffix = Path(image_path).suffix.lower()
        mime_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
        mime = mime_map.get(suffix, "image/jpeg")

        from .gemini_service import extract_keywords_vision  # noqa: WPS433
        return extract_keywords_vision(image_bytes, mime)
    except Exception as exc:
        log.warning("Gemini keyword extraction failed: %s", exc)
        return None


def _keywords_from_filename(image_path: str) -> str:
    stem = Path(image_path).stem
    return stem.replace("_", " ").replace("-", " ").strip() or "sports image"


def _fetch_image_urls(query: str) -> List[str]:
    api_key = get_google_cse_api_key()
    cse_id = get_google_cse_id()
    if not api_key or not cse_id:
        log.info("Google CSE not configured — skipping web scraping.")
        return []

    try:
        from googleapiclient.discovery import build
        service = build("customsearch", "v1", developerKey=api_key)
        result = (
            service.cse()
            .list(q=query, cx=cse_id, searchType="image", num=_MAX_RESULTS)
            .execute()
        )
        items = result.get("items", [])
        urls = [item["link"] for item in items if "link" in item]
        log.info("Custom Search returned %d image URLs for query: %s", len(urls), query)
        return urls
    except Exception as exc:
        log.warning("Custom Search API failed: %s", exc)
        return []


def _download_and_save(url: str, root_image_id: str, db: Session) -> ImageRow | None:
    try:
        resp = requests.get(url, timeout=_TIMEOUT, allow_redirects=True)
        resp.raise_for_status()

        content_type = resp.headers.get("Content-Type", "")
        if not content_type.startswith("image/"):
            log.debug("Skipping non-image URL (%s): %s", content_type, url)
            return None

        content = resp.content
        if len(content) < 1024:
            log.debug("Skipping tiny image (%d bytes): %s", len(content), url)
            return None

        ct_map = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}
        suffix = ct_map.get(content_type.split(";")[0].strip(), ".jpg")

        image_id = str(uuid4())
        ensure_storage_dirs()
        storage_rel = save_bytes_to_uploads(content, image_id, suffix=suffix)

        row = ImageRow(
            id=image_id,
            filename=f"web_{Path(url).name[:60] or image_id}{suffix}",
            storage_path=storage_rel,
            content_type=content_type.split(";")[0].strip(),
            size_bytes=len(content),
            variant_of=root_image_id,
            created_at=datetime.now(timezone.utc),
            source_url=url,
        )
        db.add(row)
        log.info("Saved web candidate: %s → %s", url, image_id)
        return row

    except Exception as exc:
        log.warning("Failed to download %s: %s", url, exc)
        return None


def scrape_web_candidates(
    db: Session,
    root_image_id: str,
    root_image_path: str,
) -> List[str]:
    keywords = _extract_keywords_gemini(root_image_path) or _keywords_from_filename(root_image_path)
    log.info("Scraping web with query: %s", keywords)

    urls = _fetch_image_urls(keywords)
    if not urls:
        return []

    created_ids: List[str] = []
    for url in urls:
        row = _download_and_save(url, root_image_id, db)
        if row:
            created_ids.append(row.id)

    if created_ids:
        db.commit()
        log.info("Web scraping registered %d candidate images.", len(created_ids))

    return created_ids
