/*
* TypeScript Logic to handle all LocalStorage Operations, needs the contact interface
*/
import {printJsonAb, restoreReactivityAb, updateBookShelf} from "./reactivity";
import {Contact} from "./structs";

/*
Creates an Addressbook in Localstorage with the name specified in its parameter and an empty JSON array.
 */
export function createAddressbook(name: string) : boolean {
    /* First, check if the desired item already exists */
    if (localStorage.getItem(name) !== null) {
        alert("Addressbook could not be created. Reason: already exists")
        return false;
    }
    localStorage.setItem(name, "[]"); //create the item with an empty JSON array
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

export function createContact(newcontact : Contact, storagekey: string) : void {
    let storage : string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json = JSON.parse(storage)
        let jsonadd = {firstname: newcontact.firstname, lastname: newcontact.lastname, phone: newcontact.phone, email: newcontact.email}
        json.push(jsonadd)
        let newstorage : string = JSON.stringify(json)
        localStorage.setItem(storagekey, newstorage)
        printJsonAb(storagekey)
    }
}