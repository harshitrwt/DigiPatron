# ContentGenome v2 Scoring Methodology

This document defines how ContentGenome v2 calculates image similarity and integrity scores.

## 1. Similarity Score Fusion
The combined similarity score (0-100) is a weighted fusion of three different fingerprinting methods. This multi-modal approach ensures robustness against various types of image modifications.

| Method | Weight | Captures | Robustness |
| :--- | :--- | :--- | :--- |
| **pHash** | 25% | Global perceptual structure | Resizing, compression, minor color shifts |
| **ORB** | 35% | Local structural keypoints | Cropping, rotation, text overlays, logo insertion |
| **MobileNetV2** | 40% | Semantic/AI feature vector | Heavy filters, meme-ification, stylistic changes |

### Fusion Formula
`Combined_Score = (pHash_Score * 0.25) + (ORB_Score * 0.35) + (Semantic_Score * 0.40)`

---

## 2. Threshold Classification
Based on the `Combined_Score`, images are classified into one of four categories:

| Score Range | Label | Action |
| :--- | :--- | :--- |
| **90 - 100** | **Original** | Verified as the root or an exact duplicate. |
| **65 - 89** | **Modified** | Detected as a derivative (reshare/repost). |
| **40 - 64** | **Likely Infringing** | High confidence of unauthorized reuse (heavy crops/edits). |
| **0 - 39** | **No Match** | Insufficient similarity detected. |

---

## 3. Content Integrity Score
The **Content Integrity Score (CIS)** is a dashboard-level metric (0-100) representing the overall "health" of an asset's digital footprint.

`CIS = 100 - (Infringing_Nodes * 15 + Modified_Nodes * 5)`
*(Capped at 0 minimum)*

- High CIS (80-100): Asset is well-protected/contained.
- Low CIS (<50): Asset is being widely misappropriated.
