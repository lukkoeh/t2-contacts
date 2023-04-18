/*
This file contains functions which are outsourced from the events.ts module to keep the code more readable.
If there is no special need to keep the functions inside the events module, they are here.
 */
import {getSelectedItem} from "./reactivity";
import {deleteAddressbookByKey} from "./storage";

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

export function handleBookSelect(this : any) : void { /* Any is used because of this not being typed. */
    this.classList.add("selected")
    let btdel : HTMLButtonElement | null = document.querySelector(".btn-bookdelete")
    if (btdel !== null) {
        btdel.disabled = false;
    }
    let elements : NodeListOf<HTMLButtonElement> | null = document.querySelectorAll(".book")
    if (elements !== null) {
        for (let i = 0; i<elements.length; i++) {
            if (elements[i] !== this) {
                elements[i].classList.remove("selected")
            }
        }
    }
}

export function deleteSelectedBook(this: any) : void { //any = instance of delete button
    let book2del : HTMLButtonElement | boolean = getSelectedItem()
    if (typeof book2del !== "boolean") {
        let key = book2del.innerHTML;
        deleteAddressbookByKey(key);
        if (book2del.parentNode !== null) {
            book2del.parentNode.removeChild(book2del);
        }
        if (localStorage.length === 0) {
            this.disabled = true;
        }
    }
    else {
        console.error("There was an error while finding the correct book, you may reselect or reload.")
    }
}