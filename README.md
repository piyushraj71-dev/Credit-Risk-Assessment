
# Credit Risk Prediction

A machine learning web application that predicts the probability of loan default based on an applicant's financial and personal information. The application uses a trained classification model and a FastAPI backend to provide risk predictions.

## Features

- Predicts the probability of loan default.
- Classifies applicants into High Risk or Low Risk using a decision threshold.
- Provides predictions through a FastAPI API.
- Includes a web-based frontend.
- Uses a preprocessing pipeline to prepare input data for the model.

## Tech Stack

- Python
- Pandas and NumPy
- Scikit-learn
- XGBoost
- FastAPI
- Uvicorn
- HTML, CSS, and JavaScript

## Project Structure

```text
Credit_Risk/
├── backend/
│   └── main.py
├── static/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── trained_model/
├── requirements.txt
├── render.yaml
├── .python-version
├── .gitignore
└── README.md
```


## How It Works

1. The user enters the loan applicant's information.
2. The backend converts the input into a DataFrame.
3. The preprocessing component transforms the input into the required format.
4. The trained model calculates the default probability.
5. The probability is compared with a configured threshold.
6. The application returns a High Risk or Low Risk classification.

## Deployment

The application can be deployed on Render using the included `render.yaml` configuration.

## Disclaimer

This project is intended for educational and demonstration purposes. Its predictions should not be treated as the sole basis for real-world lending decisions.
