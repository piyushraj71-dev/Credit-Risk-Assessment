
# Credit Risk Assessment

A machine learning web application that estimates loan default probability and classifies applicants into High Risk or Low Risk categories using a trained classification model.

## Live Demo

- **Live Application:** [Try It Here](https://credit-risk-assessment-eozr.onrender.com)
- **API Documentation:** [View API Docs](https://credit-risk-assessment-eozr.onrender.com/docs)

## Features

- Predicts the probability of loan default.
- Classifies applicants into High Risk or Low Risk using a configurable decision threshold.
- Provides predictions through a FastAPI backend.
- Offers a web interface for submitting loan applications.
- Applies preprocessing before model inference.
- Returns prediction results through a REST API.

## Tech Stack

- **Language:** Python
- **Machine Learning:** Scikit-learn, XGBoost
- **Data Processing:** Pandas, NumPy
- **Backend:** FastAPI, Uvicorn
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Render
- **Version Control:** Git, GitHub

## How It Works

1. The user enters loan applicant details through the web interface.
2. The frontend sends the application data to the FastAPI backend.
3. The backend preprocesses the input data.
4. The trained model estimates the probability of loan default.
5. The probability is compared against a decision threshold.
6. The application displays the estimated probability and risk classification.

## Project Structure

```text

Credit-Risk-Assessment/
├── backend/
│   └── main.py
├── static/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── trained_model/
│   ├── model_final.json
│   ├── preprocess.pkl
│   └── thresh_best.pkl
├── train/
│   └── Credit_risk_train.ipynb
├── requirements.txt
├── render.yaml
├── .python-version
├── .gitignore
├── LICENSE
└── README.md

```

## API Endpoint

### `POST /predict`

Accepts loan application details and returns the estimated default probability, decision threshold, and risk classification.

Example response:

```json
{
  "default_probability": 0.23,
  "threshold": 0.35,
  "Result": "Low Risk"
}
```

*The values above are illustrative and do not represent an actual model prediction.*

## Deployment

The application is deployed on Render, with the frontend and FastAPI backend served through the same web service.

## Disclaimer

This project is intended for educational and demonstration purposes. Predictions are estimates and should not be used as the sole basis for real-world lending decisions.

