import cv2
import numpy as np
from imwatermark import WatermarkEncoder, WatermarkDecoder
import logging

log = logging.getLogger(__name__)

# UUIDs are 36 chars long. 36 bytes = 288 bits.
WATERMARK_LENGTH = 36 * 8

def embed_watermark(image_bytes: bytes, payload: str) -> bytes:
    """
    Embeds a string payload (e.g. UUID) into an image using DWT-DCT steganography.
    Returns the JPEG encoded bytes of the watermarked image.
    """
    if len(payload) != 36:
        raise ValueError("Payload must be exactly 36 characters (UUID format).")
    
    # Read image from bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if bgr is None:
        raise ValueError("Could not decode image bytes for watermarking.")

    # Set up encoder
    encoder = WatermarkEncoder()
    # invisible-watermark requires the payload as bytes
    payload_bytes = payload.encode('utf-8')
    encoder.set_watermark('bytes', payload_bytes)
    
    # Encode using DWT + DCT (Discrete Wavelet Transform + Discrete Cosine Transform)
    # This is highly robust to JPEG compression and cropping.
    try:
        bgr_encoded = encoder.encode(bgr, 'dwtDct')
    except Exception as e:
        log.error(f"Watermark embedding failed: {e}")
        # If image is too small for DWT-DCT, just return original
        return image_bytes

    # Encode back to JPEG bytes
    success, encoded_image = cv2.imencode('.jpg', bgr_encoded, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    if not success:
        raise RuntimeError("Failed to encode watermarked image to JPEG.")
        
    return encoded_image.tobytes()


def extract_watermark(image_bytes: bytes) -> str | None:
    """
    Attempts to extract a 36-character UUID watermark from the image.
    Returns the UUID string if found, otherwise None.
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if bgr is None:
            return None

        decoder = WatermarkDecoder('bytes', WATERMARK_LENGTH)
        watermark_bytes = decoder.decode(bgr, 'dwtDct')
        
        if watermark_bytes:
            # Decode to string and strip null bytes
            decoded_str = watermark_bytes.decode('utf-8', errors='ignore').strip('\x00')
            if len(decoded_str) == 36 and decoded_str.count('-') == 4:
                return decoded_str
                
    except Exception as e:
        log.warning(f"Watermark extraction failed or none present: {e}")
        
    return None
