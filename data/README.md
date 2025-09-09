# 📊 Kaggle Datasets for Accessibility Platform

## Required Datasets

### 1. Dyslexia Dataset
**File**: `labelled_dysx.csv`
**Source**: Kaggle - Dyslexia Classification Dataset
**Structure**:
- `speed`: Reading speed (0-1 float)
- `survey_score`: Survey comprehension score (0-1 float)  
- `label`: Classification (0=Severe, 1=Mild, 2=No Dyslexia)

### 2. ADHD Dataset
**File**: `adhd_dataset.csv`
**Source**: Kaggle - ADHD Assessment Dataset
**Structure**:
- `Q1_1` to `Q1_9`: Hyperactivity questions (0-3 integer scale)
- `Q2_1` to `Q2_9`: Inattention questions (0-3 integer scale)
- `label`: Classification (0=No ADHD, 1=Inattentive, 2=Hyperactive, 3=Severe)

## How to Add Datasets

1. Download datasets from Kaggle
2. Place files in this `/data/` directory:
   ```
   data/
   ├── labelled_dysx.csv
   ├── adhd_dataset.csv
   └── README.md
   ```
3. Run training: `python train_real_models.py`

## Fallback System

If datasets are not found, the system automatically uses synthetic data that matches the exact structure of Kaggle datasets. This ensures the platform works immediately while maintaining compatibility with real data.

## Dataset Sources

- **Dyslexia**: Search "dyslexia classification" on Kaggle
- **ADHD**: Search "ADHD assessment questionnaire" on Kaggle

The training script will automatically detect and use real datasets when available, or fall back to synthetic data with identical structure.