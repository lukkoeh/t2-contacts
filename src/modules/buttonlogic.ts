/*
This file contains functions which are outsourced from the events.ts module to keep the code more readable.
If there is no special need to keep the functions inside the events module, they are here.
 */
import {getSelectedItem, printJsonAb} from "./reactivity";
import {deleteAddressbookByKey} from "./storage";
import {Contact} from "./structs";

/*
A function that opens up the Addressbook creation dialogue
 */
export function openAbPopUp() : void {
    const popup : HTMLDivElement | null = document.querySelector(".book-naming-popup")
    if (popup !== null) {
        popup.classList.remove("invisible");
    }
}
/*
The respective function to close the popup
 */
export function closeAbPopUp() : void {
    const popup : HTMLDivElement | null = document.querySelector(".book-naming-popup")
    if (popup !== null) {
        popup.classList.add("invisible");
    }
}

/*
This function handles the selection process. Essentially, the clicked item assigns itself as selected
and removes all other instances of the selected class from other items.
 */
export function handleBookSelect(this : any) : void { /* Any is used because of this not being typed. */
    this.classList.add("selected")
    printJsonAb(this.innerText);
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

/*
A function that deletes the book that is currently selected by the user. It utilizes the
getSelected() function to find the correct entry and then calls the storage management
to finally delete the entry via the localStorage API
 */
export function deleteSelectedBook(this: any) : void { //any = instance of delete button
    let book2del : HTMLButtonElement | boolean = getSelectedItem()
    if (typeof book2del !== "boolean") {
        let key = book2del.innerHTML;
        deleteAddressbookByKey(key);
        if (book2del.parentNode !== null) {
            book2del.parentNode.removeChild(book2del); //It quite literally deletes itself XD
        }
        if (localStorage.length === 0) {
            this.disabled = true;
        }
    }
    else {
        console.error("There was an error while finding the correct book, you may reselect or reload.")
    }
}
/*
This function allows one to print a contact into the contacts-view, without implementing the logic multiple times
But, it only takes a Contact Struct.
 */
export function spawnContact(print : Contact) {
    const container : HTMLElement | null = document.querySelector(".contact-contain")
    if (container !== null) {
        let element = document.createElement('aside')
        element.classList.add("contact-item")
        element.classList.add("ps30")
        let innerp = document.createElement("p")
        innerp.innerText = print.firstname + " " + print.lastname
        element.appendChild(innerp)
        let innerp2 = document.createElement("p")
        if (print.email !== "") {
            innerp2.innerText = print.email
        } else {
            innerp2.innerText = print.phone
        }
        element.appendChild(innerp2)
        container.appendChild(element)
    }
}

export function openCreationDialog() : void {
    let dialog : HTMLElement | null = document.querySelector(".contact-editor");
    let placeholder : HTMLElement | null = document.querySelector(".placeholder");
    let headlinecreate : HTMLParagraphElement | null = document.querySelector(".action-create-headline")
    let headlineedit : HTMLParagraphElement | null = document.querySelector(".action-create-headline")
    if (dialog !== null && placeholder !== null && headlinecreate !== null && headlineedit !== null) {
        placeholder.classList.add("invisible")
        dialog.classList.remove("invisible")
        headlineedit.classList.add("invisible")
        headlinecreate.classList.remove("invisible")
    }
}