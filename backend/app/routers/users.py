from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pathlib import Path
from sqlalchemy.orm import Session
import json
import os

from ..db import get_db
from ..models import ImageRow, AnalysisJobRow, UserRow, DmcaDraftRow
from .auth import get_current_user
from ..settings import get_storage_path

router = APIRouter()

class VaultItem(BaseModel):
    image_id: str
    filename: str
    created_at: str
    thumbnail_url: str
    integrity_score: float
    total_copies: int
    infringing_copies: int
    modified_copies: int


@router.get("/users/me/vault")
def get_user_vault(user: UserRow = Depends(get_current_user), db: Session = Depends(get_db)):
    # Find all root images for this user (where variant_of is None)
    images = db.query(ImageRow).filter(ImageRow.user_id == user.id, ImageRow.variant_of == None).order_by(ImageRow.created_at.desc()).all()
    
    vault_items = []
    for img in images:
        job = db.query(AnalysisJobRow).filter(AnalysisJobRow.image_id == img.id).order_by(AnalysisJobRow.started_at.desc()).first()
        
        score = 100.0
        total = 0
        infringing = 0
        modified = 0
        
        if job and job.status == "complete" and job.result_json:
            try:
                res = json.loads(job.result_json)
                score = res.get("integrity_score", 100.0)
                stats = res.get("stats", {})
                infringing = stats.get("infringing", 0) + stats.get("exact_copy", 0)
                modified = stats.get("modified", 0)
                total = infringing + modified
            except Exception:
                pass
                
        vault_items.append(VaultItem(
            image_id=img.id,
            filename=img.filename,
            created_at=img.created_at.isoformat(),
            thumbnail_url=f"/assets/{Path(img.storage_path).name}",
            integrity_score=score,
            total_copies=total,
            infringing_copies=infringing,
            modified_copies=modified
        ))
        
    return {"status": "success", "data": {"vault": vault_items}}


def _delete_image_file(storage_path: str) -> None:
    """Silently delete an image file from disk."""
    try:
        abs_path = get_storage_path() / storage_path
        if abs_path.exists():
            os.remove(abs_path)
    except Exception:
        pass


def _cascade_delete_image(db: Session, image_id: str) -> None:
    """Delete an image and all its variants, analysis jobs, DMCA drafts, and files."""
    # Delete variants first
    variants = db.query(ImageRow).filter(ImageRow.variant_of == image_id).all()
    for v in variants:
        # Delete analysis jobs for this variant
        db.query(AnalysisJobRow).filter(AnalysisJobRow.image_id == v.id).delete()
        _delete_image_file(v.storage_path)
        db.delete(v)

    # Delete analysis jobs for root image
    db.query(AnalysisJobRow).filter(AnalysisJobRow.image_id == image_id).delete()

    # Delete DMCA drafts
    db.query(DmcaDraftRow).filter(DmcaDraftRow.root_image_id == image_id).delete()

    # Delete the root image itself
    root = db.query(ImageRow).filter(ImageRow.id == image_id).first()
    if root:
        _delete_image_file(root.storage_path)
        db.delete(root)


@router.delete("/users/me/vault/{image_id}")
def delete_vault_item(image_id: str, user: UserRow = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete an image from the user's vault, including all variants and analysis data."""
    image = db.query(ImageRow).filter(ImageRow.id == image_id, ImageRow.user_id == user.id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found or not owned by you.")
    
    _cascade_delete_image(db, image_id)
    db.commit()
    
    return {"status": "success", "detail": "Asset and all related data deleted."}


@router.delete("/users/me/account")
def delete_account(user: UserRow = Depends(get_current_user), db: Session = Depends(get_db)):
    """Permanently delete the user's account and all their data."""
    # Delete all root images owned by the user (cascading to variants, jobs, drafts)
    root_images = db.query(ImageRow).filter(ImageRow.user_id == user.id, ImageRow.variant_of == None).all()
    for img in root_images:
        _cascade_delete_image(db, img.id)

    # Also clean up any orphaned images owned by the user (variants they uploaded directly)
    remaining = db.query(ImageRow).filter(ImageRow.user_id == user.id).all()
    for img in remaining:
        _delete_image_file(img.storage_path)
        db.delete(img)

    # Delete the user
    db.delete(user)
    db.commit()
    
    return {"status": "success", "detail": "Account and all data permanently deleted."}

