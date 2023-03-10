// Removes the "active" attribute from all previous sub cards
function resetActiveCards() {
    const subCards = document.querySelectorAll(".popup__card");
    subCards.forEach(card => card.removeAttribute("active"));
}

// Uncheck all radio buttons inside the sub cards
function resetRadioInputs() {
    const radioInputs = document.querySelectorAll(".select__input");
    radioInputs.forEach(radio => radio.checked = false);
}

// Disables all pledge input fields and resets their values to empty, except for the "no reward" input field (heart).
function resetPledgeInputs() {
    const pledgeInputs = document.querySelectorAll(".enter-pledge__pledge-input");
    pledgeInputs.forEach(input => {
        input.parentElement.removeAttribute("error");

        input.setAttribute("disabled", "");

        // Resets the inputs values to empty, except for the "no reward" input field (heart).
        if (!input.hasAttribute("readonly")) {
            setTimeout(() => input.value = "", 100);
        }
    });
}

// Clears the textContent of all error messages on the sub cards.
function resetErrorMessages() {
    const errorMessages = document.querySelectorAll(".error-msg");
    errorMessages.forEach(error => error.textContent = "");
}

/**
    1. Removes the "active" attribute from all previous sub cards
    2. Uncheck all radio buttons inside the sub cards
    3. Disables all pledge input fields and resets their values to empty, except for the "no reward" input field (heart).
    4. Clears the textContent of all error messages on the sub cards.
*/
export function resetAllSubcards() {
    resetActiveCards();
    resetRadioInputs();
    resetPledgeInputs();
    resetErrorMessages();
}