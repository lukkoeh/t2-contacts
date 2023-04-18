/*
* TypeScript Logic to handle all LocalStorage Operations, needs the contact interface
*/
import {restoreReactivityAb, updateBookShelf} from "./reactivity";

/*
Creates an Addressbook in Localstorage with the name specified in its parameter and an empty JSON array.
 */
export function createAddressbook(name: string) : boolean {
    /* First, check if the desired item already exists */
    if (localStorage.getItem(name) !== null) {
        alert("Addressbook could not be created. Reason: already exists")
        return false;
    }
    localStorage.setItem(name, "[{}]"); //create the item with an empty JSON array
     //update the view.
    updateBookShelf()
    restoreReactivityAb()
    return true;
}
/*
This function takes a key in form of a string and deletes the respective Storage entry.
 */
export function deleteAddressbookByKey(key: string) : void {
    localStorage.removeItem(key);
}