// ========== TOGGLE MOBILE MENU ==========
const menuElementsIds = ["mobileMenu", "menuDarkOverlayer", "hamburguerMenuIcon", "closeMenuIcon"];
const menuElements = menuElementsIds.map(id => document.querySelector(`#${id}`));

function toggleMobileMenu() {
    menuElements.forEach(item => {
       item.toggleAttribute("show"); 
    });
}

// This function removes eventListeners on devices with a viewport width larger than 720px. It allows us to turn the event listeners on and off when the screen size changes.
function manageMenuEventListeners() {
    const method = window.innerWidth > 720 ?
    "removeEventListener"
    : "addEventListener";

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





// ========== OPEN MAIN POPUP ==========

const backButton = document.querySelector("#backButton");
const mainPopupOverlayer = document.querySelector("#mainPopupOverlayer");
const mainPopup = document.querySelector("#mainPopup");
const closeMainPopupIcon = document.querySelector("#closeMainPopupIcon");

function openMainPopup(event) {
    mainPopupOverlayer.toggleAttribute("show");
    mainPopup.toggleAttribute("show");
}

[backButton, closeMainPopupIcon, mainPopupOverlayer].forEach(item => {
    item.addEventListener("click", openMainPopup)
});





// ========== SELECT CARD ==========

const popupCards = document.querySelectorAll(".popup__card__content");

function resetCards() {
    const pledgeDropdowns = document.querySelectorAll(".enter-pledge");
    pledgeDropdowns.forEach(dropdown => dropdown.removeAttribute("show"));

    const cards = document.querySelectorAll(".popup__card");
    cards.forEach(card => card.removeAttribute("active"));
}

function selectCard() {
    // Close previous checked drop down
    resetCards();

    // Check radio input
    const cardInput = document.querySelector(`#${this.id} .select__input`);
    cardInput.checked = true;

    // Set card border to cyan
    const card = this.parentElement;
    card.setAttribute("active", "");

    // Open pledge drop down
    const pledgeDropdown = this.nextElementSibling;
    pledgeDropdown.setAttribute("show", "");

    const input = pledgeDropdown.querySelector(".enter-pledge__text-input");
    setTimeout(() =>  {
        input.focus();
    }, 500);

    setTimeout(() =>  {
        this.scrollIntoView({ behavior: "smooth" });
    }, 150);
}

popupCards.forEach(card => {
    card.addEventListener("click", selectCard);
});

const allPledgeTextInputs = document.querySelectorAll(".enter-pledge__text-input");
const allTextInputsWrapper = document.querySelectorAll(".enter-pledge__input-wrapper");

function inputFocus() {
    const inputWrapper = this.parentElement;
    inputWrapper.setAttribute("focus", "");
}

function inputFocusOut() {
    const inputWrapper = this.parentElement;
    inputWrapper.removeAttribute("focus");
}

allPledgeTextInputs.forEach(input => {
    input.addEventListener("focus", inputFocus);
    input.addEventListener("focusout", inputFocusOut);
});

function inputWrapperClick() {
    const textInput = this.querySelector(".enter-pledge__text-input");
    textInput.focus();
}

allTextInputsWrapper.forEach(inputWrapper => {
    inputWrapper.addEventListener("click", inputWrapperClick);
});