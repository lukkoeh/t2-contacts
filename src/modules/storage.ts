/*
* TypeScript Logic to handle all LocalStorage Operations, needs the contact interface
*/
import {printJsonAb, restoreReactivityAb, updateBookShelf} from "./reactivity";
import {Contact} from "./structs";

/*
Creates an Addressbook in Localstorage with the name specified in its parameter and an empty JSON array.
 */
export function createAddressbook(name: string): boolean {
    /* First, check if the desired item already exists */
    if (localStorage.getItem(name) !== null) {
        alert("Addressbook could not be created. Reason: already exists")
        return false;
    }
    localStorage.setItem(name.trim(), "[]"); //create the item with an empty JSON array
    //update the view.
    updateBookShelf()
    restoreReactivityAb()
    return true;
}

/*
This function takes a key in form of a string and deletes the respective Storage entry.
 */
export function deleteAddressbookByKey(key: string): void {
    localStorage.removeItem(key);
}

/*
Function that creates a contact and writes it to memory. Keep in mind that the contact object has to
be created prior using the contact interface defined in structs.ts
 */
export function createContact(newcontact: Contact, storagekey: string): void {
    let storage: string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json = JSON.parse(storage)
        let jsonadd = {
            id: json.length,
            firstname: newcontact.firstname,
            lastname: newcontact.lastname,
            phone: newcontact.phone,
            email: newcontact.email
        }
        json.push(jsonadd)
        let newstorage: string = JSON.stringify(json)
        localStorage.setItem(storagekey, newstorage)
        fixIds(storagekey)
    }
}

/*
The respective function that reads the contacts out of the localStorage and deletes it.
Uses full dataset comparison to always delete the correct entry without needing to implement IDs.
 */
export function deleteContact(id: number, storagekey: string): void {
    let storage: string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json: any = JSON.parse(storage)
        for (let i: number = 0; i < json.length; i++) {
            if (json[i].id === id) {
                json.splice(i, 1)
                localStorage.setItem(storagekey, JSON.stringify(json))
                return
            }
        }
        console.error("There was an error while searching the correct entry to DELETE")
        return
    } else {
        console.error("The requested localStorage Item was not accessible. As a developer you should check the code.")
        return
    }
}

/*
Every time, a contact is created or deleted, the fixIds function fixes up the order of the IDs in the array
and re renders the whole Addressbook with the correct ids
 */
export function fixIds(storagekey: string): void {
    let storage: string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json = JSON.parse(storage)
        for (let i: number = 0; i < json.length; i++) {
            json[i].id = i;
        }
        localStorage.setItem(storagekey, JSON.stringify(json))
        printJsonAb(storagekey)
    }
}

/*
Create a function to essentially override a contact with a new version of itself, we do this by giving a function
our new contact, and we will extract the id to find the entry and replace it
 */
export function editContact(newcontact: Contact, storagekey: string): void {
    let storage: string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json: any = JSON.parse(storage)
        for (let i: number = 0; i < json.length; i++) {
            if (json[i].id === newcontact.id) {
                json[i].firstname = newcontact.firstname
                json[i].lastname = newcontact.lastname
                json[i].email = newcontact.email
                json[i].phone = newcontact.phone
            }
        }
        localStorage.setItem(storagekey, JSON.stringify(json))
        printJsonAb(storagekey)
    }
}

export function getContactById(id: number, storagekey: string): Contact | boolean {
    let storage: string | null = localStorage.getItem(storagekey)
    if (storage !== null) {
        let json: any = JSON.parse(storage)
        for (let i: number = 0; i < json.length; i++) {
            if (json[i].id === id) {
                return {
                    id: json[i].id,
                    firstname: json[i].firstname,
                    lastname: json[i].lastname,
                    email: json[i].email,
                    phone: json[i].phone
                }
            }
        }
    }
    return false;
}