from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal
import pandas as pd
import joblib
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import xgboost as xgb

ml_model = {} 
BASE_DIR = Path(__file__).resolve().parent.parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Load the data cleaner
    ml_model['preprocessor'] = joblib.load(BASE_DIR / "trained_model" / "preprocess.pkl")
    
    # 2. Load the XGBoost model
    loaded_xgb = xgb.XGBClassifier() 
    loaded_xgb.load_model(BASE_DIR / "trained_model" / "model_final.json")
    ml_model['model'] = loaded_xgb

    ml_model["threshold"]=joblib.load(BASE_DIR/"trained_model"/"thresh_best.pkl")

    yield

    ml_model.clear()

app = FastAPI(lifespan=lifespan)



@app.get("/health")
def health():
    return {"message": "api is running"}

class LoanApplication(BaseModel):
    person_age: int
    person_income: float
    person_home_ownership: Literal['RENT', 'OWN', 'MORTGAGE', 'OTHER']
    person_emp_length: float
    loan_intent: Literal['PERSONAL', 'EDUCATION', 'MEDICAL', 'VENTURE', 'HOMEIMPROVEMENT',
       'DEBTCONSOLIDATION']
    loan_grade: Literal['D', 'B', 'C', 'A', 'E', 'F', 'G']
    loan_amnt: float
    loan_int_rate: float
    loan_percent_income: float
    cb_person_default_on_file: Literal['Y', 'N']
    cb_person_cred_hist_length: int


@app.post('/predict')
def predict(data : LoanApplication):
    input_df = pd.DataFrame([data.dict()])

    cleaned_data = ml_model['preprocessor'].transform(input_df)
    
    probability = float(
        ml_model["model"].predict_proba(cleaned_data)[0, 1]
    )

    threshold = float(ml_model["threshold"])

    if probability >= ml_model["threshold"]:
        result="High Risk"
    else:
        result="Low Risk"

    return {
        "default_probability": probability,
        "threshold": float(ml_model["threshold"]),
        "Result": result
    }

app.mount(
    "/",
    StaticFiles(directory=BASE_DIR / "static", html=True),
    name="static"
)

