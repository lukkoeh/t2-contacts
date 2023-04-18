/*
* TypeScript Logic to handle all LocalStorage Operations, needs the contact interface
*/
import {updateBookShelf} from "./reactivity";

export function createAddressbook(name: string) : boolean {
    /* First, check if the desired item already exists */
    if (localStorage.getItem(name) !== null) {
        alert("Addressbook could not be created. Reason: already exists")
        return false;
    }
    localStorage.setItem(name, "[{}]"); //create the item with an empty JSON array
     //update the view.
    updateBookShelf()
    return true;
}