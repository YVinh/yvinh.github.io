function calculateYearOfZeroProfitLoss() {
    const principal = parseFloat(document.getElementById("principal").value);
    const interest = parseFloat(document.getElementById("interest").value) / 100 / 12;
    const years = parseInt(document.getElementById("years").value) * 12;

    const monthlyPayment = (principal * interest) / (1 - Math.pow(1 + interest, -years));

    const initialValue = parseFloat(document.getElementById("initialValue").value);
    const transactionCostsPercentage = parseFloat(document.getElementById("transactionCosts").value);
    const transactionCosts = (initialValue * (transactionCostsPercentage / 100)).toFixed(2);

    const growthRate = parseFloat(document.getElementById("growthRate").value) / 100;

    if (isNaN(principal)) {
        displayErrorMessage("Loan Amount");
        return;
    }

    if (isNaN(interest)) {
        displayErrorMessage("Interest Rate");
        return;
    }

    if (isNaN(years)) {
        displayErrorMessage("Loan Term");
        return;
    }

    if (isNaN(initialValue)) {
        displayErrorMessage("Initial Property Value");
        return;
    }

    if (isNaN(transactionCostsPercentage)) {
        displayErrorMessage("Transaction Costs");
        return;
    }

    if (isNaN(growthRate)) {
        displayErrorMessage("Annual Growth Rate");
        return;
    }

    const principalProperty = initialValue - transactionCosts;
    const monthlyPaymentProperty = (principalProperty * interest) / (1 - Math.pow(1 + interest, -years));
    let remainingBalanceProperty = principalProperty;
    let accruedInterestCosts = 0;

    const tableData = [];

    for (let i = 1; i <= years; i++) {
        const interestPayment = remainingBalanceProperty * interest;
        const principalPayment = monthlyPaymentProperty - interestPayment;
        accruedInterestCosts += interestPayment;
        remainingBalanceProperty -= principalPayment;

        const estimatedValue = (initialValue * Math.pow((1 + growthRate), i)).toFixed(2);
        const profitLoss = estimatedValue - initialValue - transactionCosts - accruedInterestCosts;

        tableData.push({
            year: i,
            estimatedValue,
            accruedInterest: accruedInterestCosts.toFixed(2),
            profitLoss: profitLoss.toFixed(2)
        });

        if (remainingBalanceProperty < 0) {
            break;
        }
    }

    const tableBody = document.querySelector('#yearOfZeroProfitLoss tbody');
    tableBody.innerHTML = tableData.map(row => `
        <tr>
            <td>${row.year}</td>
            <td>${formatCurrency(row.estimatedValue)}€</td>
            <td>${formatCurrency(row.accruedInterest)}€</td>
            <td>${formatCurrency(row.profitLoss)}€</td>
        </tr>
    `).join('');

    let breakEvenYear = 0;
    let accruedInterestAtBreakEven = 0;
    let estimatedValueAtBreakEven = 0;

    for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].profitLoss >= 0) {
            breakEvenYear = tableData[i].year;
            accruedInterestAtBreakEven = tableData[i].accruedInterest;
            estimatedValueAtBreakEven = tableData[i].estimatedValue;
            break;
        }
    }

    const yearOfZeroProfitLossDiv = document.getElementById("summary");
    yearOfZeroProfitLossDiv.innerHTML += `
        <p>To get break-even, you have to hold the property for at least ${breakEvenYear} years, after which you will have accrued ${formatCurrency(accruedInterestAtBreakEven)}€ interests, and the estimated value of the property will be ${formatCurrency(estimatedValueAtBreakEven)}€.</p>
        <table class="details-table">
            <tr>
                <td>Estimated property value after ${breakEvenYear} years</td>
                <td class="${(estimatedValueAtBreakEven - initialValue - transactionCosts - accruedInterestAtBreakEven) < 0 ? 'red' : ''}">
                    ${formatCurrency(estimatedValueAtBreakEven)}€
                </td>
            </tr>
            <tr>
                <td>Initial property value</td>
                <td class="red">${formatCurrency(-initialValue)}€</td>
            </tr>
            <tr>
                <td>Transaction costs</td>
                <td class="red">${formatCurrency(-transactionCosts)}€</td>
            </tr>
            <tr>
                <td>Accrued interest after ${breakEvenYear} years</td>
                <td class="red">${formatCurrency(-accruedInterestAtBreakEven)}€</td>
            </tr>
            <tr>
                <td>Profit / Loss after ${breakEvenYear} years</td>
                <td class="${(estimatedValueAtBreakEven - initialValue - transactionCosts - accruedInterestAtBreakEven) < 0 ? 'red' : ''}">
                    ${formatCurrency(estimatedValueAtBreakEven - initialValue - transactionCosts - accruedInterestAtBreakEven)}€
                </td>
            </tr>
        </table>`;
}

function calculateProfitLoss() {
    const time = parseInt(document.getElementById("time").value);
    const growthRateProperty = parseFloat(document.getElementById("growthRateProperty").value) / 100;
    const initialPropertyValue = parseFloat(document.getElementById("initialPropertyValue").value);
    const transactionCostsPropertyPercentage = parseFloat(document.getElementById("transactionCostsProperty").value);
    const transactionCostsProperty = (initialPropertyValue * (transactionCostsPropertyPercentage / 100)).toFixed(2);

    if (isNaN(time)) {
        displayErrorMessage("Time");
        return;
    }

    if (isNaN(growthRateProperty)) {
        displayErrorMessage("Annual Growth Rate (Property)");
        return;
    }

    if (isNaN(initialPropertyValue)) {
        displayErrorMessage("Initial Property Value");
        return;
    }

    if (isNaN(transactionCostsPropertyPercentage)) {
        displayErrorMessage("Transaction Costs (Property)");
        return;
    }

    const estimatedPropertyValue = (initialPropertyValue * Math.pow((1 + growthRateProperty), time)).toFixed(2);
    const profitLossProperty = estimatedPropertyValue - initialPropertyValue - transactionCostsProperty;

    const profitLossDiv = document.getElementById("profitLoss");
    profitLossDiv.innerHTML = `
        <h2>Property Value After ${time} Years</h2>
        <p>The estimated value of the property after ${time} years will be ${formatCurrency(estimatedPropertyValue)}€.</p>
        <h2>Profit / Loss After ${time} Years</h2>
        <table class="details-table">
            <tr>
                <td>Estimated property value after ${time} years</td>
                <td class="${profitLossProperty < 0 ? 'red' : ''}">${formatCurrency(estimatedPropertyValue)}€</td>
            </tr>
            <tr>
                <td>Initial property value</td>
                <td class="red">${formatCurrency(-initialPropertyValue)}€</td>
            </tr>
            <tr>
                <td>Transaction costs</td>
                <td class="red">${formatCurrency(-transactionCostsProperty)}€</td>
            </tr>
            <tr>
                <td>Profit / Loss after ${time} years</td>
                <td class="${profitLossProperty < 0 ? 'red' : ''}">${formatCurrency(profitLossProperty)}€</td>
            </tr>
        </table>`;
}

function showMortgageTable() {
    const principal = parseFloat(document.getElementById("principal").value);
    const interest = parseFloat(document.getElementById("interest").value) / 100 / 12;
    const years = parseInt(document.getElementById("years").value) * 12;

    const monthlyPayment = (principal * interest) / (1 - Math.pow(1 + interest, -years));

    const mortgageTableDiv = document.getElementById("mortgageTable");
    mortgageTableDiv.style.display = "block";

    const tableData = [];

    for (let i = 1; i <= years; i++) {
        const interestPayment = principal * interest;
        const principalPayment = monthlyPayment - interestPayment;
        principal -= principalPayment;

        tableData.push({
            month: i,
            principalPayment: formatCurrency(principalPayment),
            interestPayment: formatCurrency(interestPayment),
            remainingBalance: formatCurrency(principal)
        });
    }

    const tableBody = document.querySelector('#mortgageTable table');
    tableBody.innerHTML = tableData.map(row => `
        <tr>
            <td>${row.month}</td>
            <td>${row.principalPayment}€</td>
            <td>${row.interestPayment}€</td>
            <td>${row.remainingBalance}€</td>
        </tr>
    `).join('');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function displayErrorMessage(fieldName) {
    const yearOfZeroProfitLossDiv = document.getElementById("yearOfZeroProfitLoss");
    yearOfZeroProfitLossDiv.innerHTML = `<h2>Error</h2>
                                        <p>Missing input: Please complete the ${fieldName} field.</p>`;
}
