// NOTE: Most, if not all, uses of setTimeout are intended to enhance the user experience by simulating a sequence of events and delaying specific changes in the interface. This creates a smoother and more organized transition between different actions, resulting in a more polished user interface.

import { getElementsFromIds } from "./utils/utils";
import { resetAllSubcards } from "./resetCards";
import { globalState } from "./globalState";





// ========== TOGGLE MOBILE MENU ==========

const menuElements = getElementsFromIds("mobileMenu", "mobileMenuOverlayer", "hamburguerMenuIcon", "closeMenuIcon");

function toggleMobileMenu() {
    menuElements.forEach(item => {
       item.toggleAttribute("show"); 
    });
}

// This function removes eventListeners on devices with a viewport width larger than 720px. It allows us to turn the event listeners on and off when the screen size changes.
function manageMenuEventListeners() {
    const method = window.innerWidth > 720 ? "removeEventListener" : "addEventListener";

    /* TOGGLE MENU WHEN CLICKING
        1. The haburguer or close menu icon.
        2. Outside the menu (Overlayer).
        3. A link in the menu.
    */

    menuElements.forEach(item => {
        item[method]("click", toggleMobileMenu);
    });
}

manageMenuEventListeners();
window.addEventListener("resize", manageMenuEventListeners);





// ========== BOOKMARK BUTTON ==========

const bookmarkButton = document.querySelector("#bookmarkButton");
const bookmarkText = document.querySelector("#bookmarkText");

function toggleBookmarkButton() {
    bookmarkButton.toggleAttribute("bookmarked");

    const isBookmarked = bookmarkButton.hasAttribute("bookmarked");
    bookmarkText.textContent = isBookmarked ? "ed" : "";
}

bookmarkButton.addEventListener("click", toggleBookmarkButton);





// ========== SELECT CARD ==========

const popupSubCards = document.querySelectorAll(".popup__card__content");

/*
    1. Sets the "active" attribute to the card.
    2. Checks radio input.
    3. Set focus to the pledge input.
    4. Scrolls the card to the visible area of the popup
*/
function selectCard(cardId) {
    // Determine the card element to be selected using either its cardId with document.querySelector or the parent element of the triggered event with this.parentElement.
    const card = cardId ? document.querySelector(`#${cardId}`) : this.parentElement;

    // If the card is already "active", it has already been selected and doesn't need to be selected again
    if (card.hasAttribute("active")) return;

    // Resets all subcards
    resetAllSubcards();




    /* ===== Actual card selection ===== */


    // 1. Sets the "active" attribute to the card
    card.setAttribute("active", "");

    // 2. Checks the radio input
    const cardRadio = card.querySelector(".select__input");
    cardRadio.checked = true;

    // 3. Focus the pledge input and removes "disabled" attribute
    const pledgeInput = card.querySelector(".enter-pledge__pledge-input");
    pledgeInput.removeAttribute("disabled");

    // For not focusing readonly inputs
    if (!pledgeInput.hasAttribute("readonly")) {
        setTimeout(() => pledgeInput.focus(), 500);
    }

    // 4. Scrolls the card into the visible area of the popup
    setTimeout(() => card.scrollIntoView({ behavior: "smooth" }), 150);
}

popupSubCards.forEach(card => {
    card.addEventListener("click", () => selectCard.call(card, null));
});





// ========== TOGGLE MAIN POPUP ==========

const backButton = document.querySelector("#backButton");
const mainOverlayer = document.querySelector("#mainOverlayer");
const mainPopup = document.querySelector("#mainPopup");
const closeMainPopupIcon = document.querySelector("#closeMainPopupIcon");

function toggleMainPopup() {
    resetAllSubcards();

    mainOverlayer.toggleAttribute("show");
    mainPopup.toggleAttribute("show");

    // Every time the popup toggles, it scrolls all the way to the top
    setTimeout(() => mainPopup.children[0].scrollIntoView(), 100);
}

[backButton, closeMainPopupIcon, mainOverlayer].forEach(item => {
    item.addEventListener("click", toggleMainPopup)
});





// ========== OPEN / CLOSE THANKS POPUP ==========

const thanksPopup = document.querySelector("#thanksPopup");
const thanksOverlayer = document.querySelector("#thanksOverlayer");
const gotItButton = document.querySelector("#gotItButton");
const statsWrapper = document.querySelector("#statsWrapper");

// Sets "active" attribute and make it visible by default
statsWrapper.setAttribute("active", "");

/*
  1. Scrolls into view the stats section
  2. Removes and adds the "active" attribute to create a fade-in animation
  3. Renders a progress bar
  4. Renders stats
*/
function renderStats() {
    // 1. Scroll into view stats section
    setTimeout(() => {
        statsWrapper.scrollIntoView({ behavior: "smooth" })
    }, 300);
    
    // 2. Remove and add the "active" attribute to create a fade-in animation for the stats section every time the function is called
    statsWrapper.removeAttribute("active");
    setTimeout(() => {
        statsWrapper.setAttribute("active", "")
    }, 500);


    // 3. Renders progress bar
    globalState.renderProgressBar();
    
    // 4. Renders stats
    setTimeout(() => {
        globalState.renderStats();
    }, 1000);
}

// Show thanks popup
function openThanksPopup() {
    thanksOverlayer.setAttribute("show", "");
    thanksPopup.setAttribute("show", "");
}

// Hides thanks popup and trigger renderStats
function closeThanksPopup() {
    thanksOverlayer.removeAttribute("show");
    thanksPopup.removeAttribute("show");

    // Renders stats after popup is closed
    renderStats();
}

gotItButton.addEventListener("click", closeThanksPopup);





// ========== FOCUSING PLEDGE INPUT ==========

const pledgeInputsWrappers = document.querySelectorAll(".enter-pledge__input-wrapper");

// When the pledgeInputsWrapper is clicked, the focus will be set to the pledge input.
pledgeInputsWrappers.forEach(inputWrapper => {
    inputWrapper.addEventListener("click", () => {
        inputWrapper.querySelector("input").focus()
    });
});





// ========== OPEN POPUP AND SELECT SUBCARD WITH THE "SELECT REWARD" BUTTONS ==========

const selectCardsButtons = getElementsFromIds("selectBambooButton", "selectBlackButton", "selectMahoganyButton");

// Selects certain popup subcards based on the ID of the button that triggered the event. The specific subcards are identified by their own unique IDs.
selectCardsButtons.forEach(button => {
    button.addEventListener("click", () => {
        toggleMainPopup();

        let cardId = "";

        switch (button.id) {
            case "selectBambooButton":
                cardId = "bambooCard"
                break;

            case "selectBlackButton":
                cardId = "blackCard"
                break;

            case "selectMahoganyButton":
                cardId = "mahoganyCard"
                break;
        }

        selectCard(cardId);
    });
});




// ========== SEND FORM ==========

function sendForm(plan, value) {
    setTimeout(() => {
        toggleMainPopup();
        openThanksPopup();

        // Updates the global state depending on the plan selected and value entered, and renders de data into the DOM
        globalState.updateGlobalState(plan, value)
    }, 500);
}




// ========== FORM VALIDATION ==========

const popupForm = document.querySelector("#popupForm");

function validateForm(event) {
    // Prevents the default form submission behavior to allow custom validation
    event.preventDefault();

    
    /* ========== NO REWARD CARD ========== */

    const noRewardCard = popupForm.querySelector("#noRewardCard");
    const noRewardCardText = noRewardCard.querySelector(".popup__card__text");

    // If the "no reward" card is selected, thanks the user and returns without validation (not required)
    if (noRewardCard.hasAttribute("active")) {
        setTimeout(() => {
            noRewardCardText.textContent = "Thanks for your support! If you'd like to contribute further, please consider pledging with one of our available reward options. Your continued support helps us to further develop and improve our project."
        }, 500);

        sendForm("noReward", 0);
        return;
    }


    /* ========== OTHER CARDS ========== */

    // Selects the current pledge input by finding an <input type="text/> element that does not have the "disabled" attribute. All pledge inputs are disabled by default, and the "disabled" attribute is only removed when the card is "active" or "selected".
    const currentPledgeInput = popupForm.querySelector(`input[plan]:not([disabled])`);


    // Removes any previous error state from the pledge input's wrapper element
    const currentPledgeInputWrapper = currentPledgeInput.parentElement;
    currentPledgeInputWrapper.removeAttribute("error");

    // Removes any previous active state fromt the error message on the selected card element
    const errorMessage = popupForm.querySelector(".popup__card[active] .error-msg");
    errorMessage.removeAttribute("active");


    /* ========== VALIDATIONS ========== */

    // Plan selected (card)
    const plan = currentPledgeInput.getAttribute("plan");

    // Converts the pledge value and min/max values to numbers for comparison
    const value = Number(currentPledgeInput.value);
    const minValue = Number(currentPledgeInput.getAttribute("min-value"));
    const maxValue = Number(currentPledgeInput.getAttribute("max-value"));

    // Determines if the pledge value is empty, too low, or too high
    const isEmpty = value === 0;
    const notEnough = value < minValue;
    const tooMuch = value > maxValue;

    // If there is any error, set the "error" attribute to the inputWrapper to create the "shaking" animation effect, activates the errorMessage on the card to create the "fade-in" animation effect, and refocuses the input element.
    if (isEmpty || notEnough || tooMuch) {
        // "setTimeouts" are for delaying the error state animations for better UX
        setTimeout(() => currentPledgeInputWrapper.setAttribute("error", ""), 150);
        setTimeout(() => errorMessage.setAttribute("active", ""), 150);
        setTimeout(() => currentPledgeInput.focus(), 1000);
    }


    /* ========== ERROR MESSAGE ========== */

    let msg = "";
    
    // Sets an error message ("msg") based on the type of error
    switch (true) {
        case isEmpty:
            msg = "Please enter your pledge";
            break;

        case notEnough:
            msg = `Please enter a higher pledge, the minimum for this plan is ${minValue}.`;
            break;

        case tooMuch:
            msg = `The maximum pledge for this plan is ${maxValue}. If you would like to donate more, please select another plan for greater benefits.`;
            break;

        default:
            msg = "";
            sendForm(plan, value);
    }

    // Sets the errorMessage textContent to the value of "msg" and displays it on the card
    errorMessage.textContent = msg;
}

popupForm.addEventListener("submit", validateForm);





// ========== RESTRICT PLEDGE INPUTS TO NUMERICAL VALUES (INTEGERS) ==========

const pledgeInputs = document.querySelectorAll(".enter-pledge__pledge-input");

function setNumericFormat() {
    // Replaces any non-numeric characters in the input field with an empty string, ensuring that only numbers can be displayed in the input.
    this.value = this.value.replace(/[^0-9]+/g, "");
}

pledgeInputs.forEach(input => {
    input.addEventListener("input", setNumericFormat);
});