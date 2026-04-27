from __future__ import annotations

from typing import Any, Dict, List, Optional


def build_propagation_dag(
    root_image_id: str,
    candidates: List[Dict[str, Any]],
    root_url: Optional[str] = None,
) -> Dict[str, Any]:
    root_url = root_url or f"/assets/{root_image_id}.png"

    nodes: List[Dict[str, Any]] = [
        {
            "id": "node-0",
            "image_id": root_image_id,
            "label": "Original",
            "url": root_url,
            "authenticity_label": "Original",
            "similarity_score": 100,
            "mutation_type": "None",
            "filename": None,
            "created_at": None,
            "breakdown": {
                "phash_score": 100.0,
                "orb_score": 100.0,
                "semantic_score": 100.0,
            },
            "source_kind": "root_upload",
        }
    ]
    edges: List[Dict[str, Any]] = []

    ordered = sorted(candidates, key=lambda c: float(c.get("similarity_score", 0.0)), reverse=True)

    for idx, cand in enumerate(ordered, start=1):
        node_id = f"node-{idx}"
        nodes.append(
            {
                "id": node_id,
                "image_id": cand.get("image_id") or cand.get("id") or f"unknown-{idx}",
                "label": cand.get("authenticity_label") or "Candidate",
                "url": cand.get("url") or "",
                "authenticity_label": cand.get("authenticity_label") or "No Match",
                "similarity_score": float(cand.get("similarity_score", 0.0)),
                "mutation_type": cand.get("mutation_type") or "Unknown",
                "filename": cand.get("filename"),
                "created_at": cand.get("created_at"),
                "breakdown": cand.get("breakdown"),
                "source_kind": cand.get("source_kind"),
            }
        )
        edges.append(
            {
                "source": "node-0",
                "target": node_id,
                "weight": float(cand.get("similarity_score", 0.0)),
                "label": cand.get("mutation_type") or "Unknown",
            }
        )

    return {"root_id": root_image_id, "nodes": nodes, "edges": edges}
