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
/*
Function that creates a contact and writes it to memory. Keep in mind that the contact object has to
be created prior using the contact interface defined in structs.ts
 */
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
/*
The respective function that reads the contacts out of the localStorage and deletes it.
Uses full dataset comparison to always delete the correct entry without needing to implement IDs.
 */
export function deleteContact(contact : Contact, storagekey: string) : void {
    let storage : string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json : any = JSON.parse(storage)
        for (let i : number = 0; i<json.length; i++) {
            if (json[i].firstname === contact.firstname && json[i].lastname === contact.lastname && json[i].email === contact.email && json[i].phone === contact.phone) {
                json.splice(i,i)
                localStorage.setItem(storagekey,JSON.stringify(json))
                return
            }
        }
        console.error("There was an error while searching the correct entry to DELETE")
        return
    }
    else {
        console.error("The requested localStorage Item was not accessible. As a developer you should check the code.")
        return
    }
}