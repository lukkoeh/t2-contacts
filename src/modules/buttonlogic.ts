/*
This file contains functions which are outsourced from the events.ts module to keep the code more readable.
If there is no special need to keep the functions inside the events module, they are here.
 */
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