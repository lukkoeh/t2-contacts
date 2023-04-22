/*
This file contains functions to update various components of the site to mimic reactivity.
Those functions are made to be called as often as the situation needs them to be called.
 */
import {closeViewer, handleBookSelect, openViewer, spawnContact} from "./buttonlogic";
import {Contact} from "./structs";
import {createAddressbook} from "./storage";

export function updateBookShelf() : void {
    const container : Element | null = document.querySelector(".books-dyn");
    if (container !== null) {
        container.innerHTML = "";
        for (let i = 0; i<window.localStorage.length; i++) {
            let element = document.createElement('div')
            element.innerHTML = '<button class="element-bookshelf book ps20">' + localStorage.key(i) + "</button>"
            container.appendChild(element)
        }
        restoreReactivityAb()
    } else {
        console.error("unable to bind to container element")
        return;
    }
}

/*
Everytime a new object (contact, book) is created or rendered!, it has no event listener. We have to restore that.
*/
export function restoreReactivityAb() : void {
    let books : NodeListOf<HTMLButtonElement> = document.querySelectorAll(".book")
    for (let i : number = 0; i<books.length; i++) {
        books[i].addEventListener("click", handleBookSelect);
    }
    let contacts : NodeListOf<HTMLElement> | null = document.querySelectorAll(".contact-item")
    if (contacts !== null) {
        for (let i: number = 0; i<contacts.length; i++) {
            contacts[i].addEventListener("click", toggleMultiSelect)
            contacts[i].addEventListener("dblclick", openViewer)
        }
    }
    handleButtonDisable()
}
/*
A function to get the currently selected item.
 */
export function getSelectedItem() : HTMLButtonElement | boolean {
    let elements : NodeListOf<HTMLButtonElement> | null = document.querySelectorAll(".book");
    for (let i = 0; i<elements.length; i++) {
        if (elements[i].classList.contains("selected")) {
            return elements[i];
        }
    }
    console.error("tried to access non existent selected item. If you are a developer you may check...")
    return false;
}
/*
Print an addressbook into the contactlist using its storagekey
 */
export function printJsonAb(storagekey : string) : void {
    let storage : string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        // First, clear the contact list
        let list : HTMLDivElement | null = document.querySelector(".contact-contain")
        if (list !== null) {
            list.innerHTML = ""; // reset the container
        }
        let tmp = JSON.parse(storage)
        if (Object.keys(tmp).length === 0) { return; }
        // If our JSON is blank, we dont need to print a html div
        for (let i : number = 0; i<Object.keys(tmp).length; i++) {
            let newcontact : Contact = {
                id: tmp[i].id,
                firstname: tmp[i].firstname,
                lastname: tmp[i].lastname,
                email: tmp[i].email,
                phone: tmp[i].phone
            } // create a new contact object
            // After contact creation, spawn it
            spawnContact(newcontact);
        }
        restoreReactivityAb()
    }
}

/*
Function to add the multiselect class to clicked items, it uses a toggle logic
*/
export function toggleMultiSelect(this: any) : void {
    if(this.classList.contains("multiselect")) {
        this.classList.remove("multiselect")
        handleButtonDisable()
    } else {
        this.classList.add("multiselect")
        handleButtonDisable()
    }
}

/*
Checker function to check if any item is selected, if its more than 1, disable the edit button, if more than 1, enable the
delete button, if its exactly 1, enable the edit button, if its 0, just disable everything.
 */
export function handleButtonDisable() : void {
    let buttonedit : HTMLButtonElement | null = document.querySelector(".btn-edit-contact")
    let buttondelete : HTMLButtonElement | null = document.querySelector(".btn-delete-contact")
    let elements : NodeListOf<HTMLElement> | null = document.querySelectorAll(".multiselect");
    if (buttonedit !== null && buttondelete !== null) {
        if (elements.length === 0) {
            buttonedit.disabled = true
            buttondelete.disabled = true
        }
        else if (elements.length === 1) {
            buttonedit.disabled = false
            buttondelete.disabled = false
        }
        else if (elements.length > 1) {
            buttonedit.disabled = true
            buttondelete.disabled = false
        }
    }
}

/*
Create a function to auto select and render a new addressbook after one was deleted. Consider that there might be NO ADDRESSBOOK left...
 */
export function abDeletionHook() : void {
    closeViewer()
    if (localStorage.length === 0) { // 0 = there is no ab left
        createAddressbook("Default")
        printJsonAb("Default")
    } else {
        let storage : string | null = localStorage.key(0)
        if (storage !== null) {
            printJsonAb(storage)
            let abs : NodeListOf<HTMLButtonElement> | null = document.querySelectorAll(".book")
            for (let i : number = 0; i<abs.length; i++) {
                if (abs[i].innerText === storage) {
                    abs[i].classList.add("selected")
                } else {
                    abs[i].classList.remove("selected")
                }
            }

        }
    }
}