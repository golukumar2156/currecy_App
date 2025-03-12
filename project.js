const url = `https://v6.exchangerate-api.com/v6/6cc1f89daf346fe1cd4d68b8/latest/`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button"); // Fixed button selection
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {  // Using your existing countryList
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update flag based on selected currency
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode]; // Using your existing countryList
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Handle conversion button click
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    
    let amountInput = document.querySelector(".amount input");
    let amtVal = amountInput.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }

    let fromCurrency = fromCurr.value;
    let toCurrency = toCurr.value;

    // Fetch exchange rate
    try {
        const response = await fetch(`${url}${fromCurrency}`);
        const data = await response.json();

        if (data.conversion_rates[toCurrency]) {
            let rate = data.conversion_rates[toCurrency];
            let finalAmount = (amtVal * rate).toFixed(2);

            msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
        } else {
            msg.innerText = "Invalid currency conversion.";
        }
    } catch (error) {
        msg.innerText = "Error fetching exchange rates. Try again.";
        console.error("API Fetch Error:", error);
    }
});
