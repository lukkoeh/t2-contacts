/*
This file contains functions to update various components of the site to mimic reactivity.
Those functions are made to be called as often as the situation needs them to be called.
 */
import {handleBookSelect, spawnContact} from "./buttonlogic";
import {Contact} from "./structs";

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
Everytime a new object is created, it has no event listener. We have to restore that.
*/
export function restoreReactivityAb() {
    let books : NodeListOf<HTMLButtonElement> = document.querySelectorAll(".book")
    console.log(books.length)
    for (let i = 0; i<books.length; i++) {
        let element : HTMLButtonElement = books[i]
        element.addEventListener("click", handleBookSelect);
    }
}
/*
Function to check if any item is selected right now
 */
export function somethingSelected() : boolean {
    let elements : NodeListOf<HTMLButtonElement> | null = document.querySelectorAll(".book");
    for (let i = 0; i<elements.length; i++) {
        if (elements[i].classList.contains("selected")) {
            return true;
        }
    }
    return false;
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
                firstname: tmp[i].firstname,
                lastname: tmp[i].lastname,
                email: tmp[i].email,
                phone: tmp[i].phone
            } // create a new contact object
            // After contact creation, spawn it
            spawnContact(newcontact);
        }
    }
}