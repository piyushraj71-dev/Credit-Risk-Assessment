
const form = document.getElementById("loan-form");

const incomeInput = document.getElementById("person_income");
const loanAmountInput = document.getElementById("loan_amnt");
const ratioInput = document.getElementById("loan_percent_income");

function calculateLoanRatio() {
    const income = Number(incomeInput.value);
    const loanAmount = Number(loanAmountInput.value);

    if (
        incomeInput.value.trim() === "" ||
        loanAmountInput.value.trim() === "" ||
        !Number.isFinite(income) ||
        !Number.isFinite(loanAmount) ||
        income <= 0 ||
        loanAmount < 0
    ) {
        ratioInput.value = "";
        return;
    }

    ratioInput.value = (loanAmount / income).toFixed(4);
}

incomeInput.addEventListener("input", calculateLoanRatio);
loanAmountInput.addEventListener("input", calculateLoanRatio);

calculateLoanRatio();


const predictButton = document.getElementById("predict-button");
const buttonLabel = document.getElementById("button-label");
const buttonArrow = document.getElementById("button-arrow");
const formError = document.getElementById("form-error");

const probabilityElement = document.getElementById("probability");
const thresholdElement = document.getElementById("threshold");
const resultElement = document.getElementById("risk-result");
const classificationElement = document.getElementById("classification");
const descriptionElement = document.getElementById("result-description");
const gauge = document.getElementById("gauge");
const riskStatus = document.getElementById("risk-status");

function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
}

function clearError() {
    formError.textContent = "";
    formError.hidden = true;
}

function setLoading(isLoading) {
    predictButton.disabled = isLoading;
    buttonLabel.textContent = isLoading
        ? "Analyzing application..."
        : "Assess credit risk";

    buttonArrow.textContent = isLoading ? "…" : "↗";
}

function resetResults() {
    probabilityElement.innerHTML = '--<small>%</small>';
    thresholdElement.textContent = "--";
    classificationElement.textContent = "--";
    resultElement.textContent = "Awaiting assessment";

    descriptionElement.textContent =
        "Complete the application form and select Assess credit risk to generate a prediction.";

    gauge.style.setProperty("--progress", "0deg");
    riskStatus.className = "risk-status status-neutral";
}

function displayResults(data) {
    const probability = Number(data.default_probability);
    const threshold = Number(data.threshold);
    const result = data.Result;

    if (
        !Number.isFinite(probability) ||
        !Number.isFinite(threshold) ||
        !["High Risk", "Low Risk"].includes(result)
    ) {
        throw new Error("The API returned an unexpected prediction response.");
    }

    if (probability < 0 || probability > 1 ||
        threshold < 0 || threshold > 1) {
        throw new Error("The API returned an invalid probability or threshold.");
    }

    const percentage = probability * 100;
    const thresholdPercentage = threshold * 100;
    const progress = Math.min(percentage, 100) * 3.6;

    probabilityElement.innerHTML =
        `${percentage.toFixed(1)}<small>%</small>`;

    thresholdElement.textContent =
        `${thresholdPercentage.toFixed(1)}%`;

    resultElement.textContent = result;
    classificationElement.textContent = result;

    gauge.style.setProperty("--progress", `${progress}deg`);

    if (result === "High Risk") {
        riskStatus.className = "risk-status status-high";
        descriptionElement.textContent =
            "The predicted default probability meets or exceeds your configured decision threshold. Review this application carefully.";
    } else {
        riskStatus.className = "risk-status status-low";
        descriptionElement.textContent =
            "The predicted default probability is below your configured decision threshold. This classification does not guarantee repayment.";
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    if (!form.reportValidity()) {
        return;
    }

    const formData = new FormData(form);

    // Convert numerical form values to the types expected by FastAPI.
    const loanData = {
        person_age: Number(formData.get("person_age")),
        person_income: Number(formData.get("person_income")),
        person_home_ownership: formData.get("person_home_ownership"),
        person_emp_length: Number(formData.get("person_emp_length")),
        loan_intent: formData.get("loan_intent"),
        loan_grade: formData.get("loan_grade"),
        loan_amnt: Number(formData.get("loan_amnt")),
        loan_int_rate: Number(formData.get("loan_int_rate")),
        loan_percent_income: Number(formData.get("loan_percent_income")),
        cb_person_default_on_file:
            formData.get("cb_person_default_on_file"),
        cb_person_cred_hist_length:
            Number(formData.get("cb_person_cred_hist_length"))
    };

    const numericFields = [
        "person_age",
        "person_income",
        "person_emp_length",
        "loan_amnt",
        "loan_int_rate",
        "loan_percent_income",
        "cb_person_cred_hist_length"
    ];

    if (!numericFields.every(key => Number.isFinite(loanData[key]))) {
        showError("Please enter valid numerical values in all required fields.");
        return;
    }

    if (loanData.person_income <= 0 || loanData.loan_amnt <= 0) {
        showError("Annual income and loan amount must be greater than zero.");
        return;
    }

    setLoading(true);

    try {
        // Uses the same origin as the page served by FastAPI.
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loanData)
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
            const details = Array.isArray(data.detail)
                ? data.detail.map(item =>
                    `${item.loc?.slice(1).join(".") || "Input"}: ${item.msg}`
                ).join("; ")
                : typeof data.detail === "string"
                    ? data.detail
                    : "Please check your inputs and server logs.";

            throw new Error(`Request failed (${response.status}): ${details}`);
        }

        displayResults(data);

    } catch (error) {
        console.error("Credit risk prediction error:", error);

        showError(
            error instanceof TypeError
                ? "Could not connect to the prediction API. Check that FastAPI is running."
                : error.message
        );
    } finally {
        setLoading(false);
    }
});

document.getElementById("reset-button").addEventListener("click", () => {
    form.reset();
    clearError();
    resetResults();
});

resetResults();
