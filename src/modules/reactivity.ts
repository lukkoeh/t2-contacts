/*
This file contains functions to update various components of the site to mimic reactivity.
Those functions are made to be called as often as the situation needs them to be called.
 */
import {handleBookSelect} from "./buttonlogic";

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