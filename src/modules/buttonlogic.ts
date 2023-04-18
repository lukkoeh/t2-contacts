export function openAbPopUp() : void {
    const popup : HTMLDivElement | null = document.querySelector(".book-naming-popup")
    if (popup !== null) {
        popup.classList.remove("invisible");
    }
}

export function closeAbPopUp() : void {
    const popup : HTMLDivElement | null = document.querySelector(".book-naming-popup")
    if (popup !== null) {
        popup.classList.add("invisible");
    }
}