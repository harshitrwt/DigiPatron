from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path

from ..db import get_db
from ..models import ImageRow, UserRow
from .auth import get_current_user
from ..settings import get_storage_path
from engine.watermark import embed_watermark

router = APIRouter()

@router.post("/protect/{image_id}")
def protect_image(image_id: str, user: UserRow = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Applies an invisible steganographic watermark to a user's image.
    Returns the URL to download the protected image.
    """
    image = db.query(ImageRow).filter(ImageRow.id == image_id, ImageRow.user_id == user.id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found or not owned by user.")
    
    if image.variant_of is not None:
        raise HTTPException(status_code=400, detail="Cannot protect a variant, only original assets.")
        
    abs_path = get_storage_path() / image.storage_path
    if not abs_path.exists():
        raise HTTPException(status_code=404, detail="Original image file missing.")
        
    protected_rel_path = f"uploads/{image_id}_protected.jpg"
    protected_abs_path = get_storage_path() / protected_rel_path
    
    # If already protected, just return the URL
    if not protected_abs_path.exists():
        with open(abs_path, "rb") as f:
            original_bytes = f.read()
            
        try:
            protected_bytes = embed_watermark(original_bytes, image_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to embed watermark: {e}")
            
        with open(protected_abs_path, "wb") as f:
            f.write(protected_bytes)
            
    return {"status": "success", "data": {"url": f"http://localhost:8000/assets/{image_id}_protected.jpg"}}
