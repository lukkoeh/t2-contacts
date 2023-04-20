/*
This file contains functions which are outsourced from the events.ts module to keep the code more readable.
If there is no special need to keep the functions inside the events module, they are here.
 */
import {getSelectedItem, printJsonAb, restoreReactivityAb} from "./reactivity";
import {deleteAddressbookByKey, deleteContact, fixIds, getContactById} from "./storage";
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
        element.setAttribute("contactid", print.id.toString())
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
/*
Changes the visibility of the contact creation / edit form and in return hides all other
forms from the edit area
 */
export function openCreationDialog() : void {
    let dialog : HTMLElement | null = document.querySelector(".contact-editor");
    let placeholder : HTMLElement | null = document.querySelector(".placeholder");
    let headlinecreate : HTMLParagraphElement | null = document.querySelector(".action-create-headline")
    let headlineedit : HTMLParagraphElement | null = document.querySelector(".action-create-headline")
    let oldsvbtn : HTMLButtonElement | null = document.querySelector(".btn-save")
    let editsvbtn : HTMLButtonElement | null = document.querySelector(".btn-edit-save")
    if (dialog !== null && placeholder !== null && headlinecreate !== null && headlineedit !== null && oldsvbtn !== null && editsvbtn !== null) {
        placeholder.classList.add("invisible")
        dialog.classList.remove("invisible")
        headlineedit.classList.add("invisible")
        headlinecreate.classList.remove("invisible")
        oldsvbtn.classList.remove("invisible")
        editsvbtn.classList.add("invisible")
    }
}
/*
Function to be used to hide the edit or create form respectively, does NOT modify
the headlines. Re-enables the placeholder
 */
export function closeCreationDialog() : void {
    let dialog : HTMLElement | null = document.querySelector(".contact-editor")
    let placeholder : HTMLElement | null = document.querySelector(".placeholder")
    let inputgroup : NodeListOf<HTMLInputElement> | null = document.querySelectorAll(".form-input")
    if (dialog !== null && placeholder !== null && inputgroup !== null) {
        //first, switch the invisible class
        dialog.classList.add("invisible")
        placeholder.classList.remove("invisible")
        for (let i : number = 0; i<inputgroup.length; i++) {
            inputgroup[i].value = ""; //clear values
        }
    }

}

/*
We need to prevent the fixIds() function from executing until all storage operations are done.
That is why we toggle it here instead of in the storage module itself. We create a list of all items
that should be deleted, then we cycle through, extract the IDs and delete the corresponding entries.
 */
export function deleteSelectedContacts(this: any) : void {
    let selectedab : HTMLButtonElement | null = document.querySelector(".selected")
    if (selectedab !== null) {
        let storagekey : string = selectedab.innerText
        let it2d : NodeListOf<HTMLElement> | null = document.querySelectorAll(".multiselect")
        for (let i : number = 0; i< it2d.length; i++) {
            let idstring : string | null = it2d[i].getAttribute("contactid")
            if (idstring !== null) {
                let newid : number = Number.parseInt(idstring)
                deleteContact(newid, storagekey)
            }
        }
        fixIds(storagekey)
        restoreReactivityAb()
    }
}

/*
Open up the editor and disable anything else.
*/
export function openEditDialog() : void {
    let dialog : HTMLElement | null = document.querySelector(".contact-editor");
    let placeholder : HTMLElement | null = document.querySelector(".placeholder");
    let headlinecreate : HTMLParagraphElement | null = document.querySelector(".action-create-headline")
    let headlineedit : HTMLParagraphElement | null = document.querySelector(".action-edit-headline")
    let editsvbtn : HTMLButtonElement | null = document.querySelector(".btn-edit-save")
    let oldsvbtn : HTMLButtonElement | null = document.querySelector(".btn-save")
    let viewclosebtn : HTMLButtonElement | null = document.querySelector(".btn-close-viewer")
    let viewer : HTMLElement | null = document.querySelector(".contact-viewer")
    if (editsvbtn !== null && oldsvbtn !== null && viewclosebtn !== null) {
        editsvbtn.classList.remove("invisible")
        oldsvbtn.classList.add("invisible")
        viewclosebtn.classList.add("invisible")
    }
    if (dialog !== null && placeholder !== null && headlinecreate !== null && headlineedit !== null && viewer !== null) {
        placeholder.classList.add("invisible")
        dialog.classList.remove("invisible")
        headlineedit.classList.remove("invisible")
        headlinecreate.classList.add("invisible")
        viewer.classList.add("invisible")
    }
    let inputgroup : NodeListOf<HTMLInputElement> | null = document.querySelectorAll(".form-input")
    let selectedcontact : HTMLElement | null = document.querySelector(".multiselect") //only first element
    let selectedab : HTMLButtonElement | null = document.querySelector(".selected")
    if (selectedcontact !== null && selectedab !== null) {
        console.log(selectedcontact)
        let storagekey : string = selectedab.innerText;
        let contactid : string | null = selectedcontact.getAttribute("contactid")
        if (contactid !== null) {
            let finalid : number = Number.parseInt(contactid)
            let contactitem : Contact | boolean = getContactById(finalid, storagekey)
            if (typeof contactitem === "boolean") {
                console.error("There was an error while getting the contact to prefill it into the form. Editing might not be possible")
            }
            else {
                if (inputgroup !== null && dialog !== null) {
                    inputgroup[0].value = contactitem.firstname
                    inputgroup[1].value = contactitem.lastname
                    inputgroup[2].value = contactitem.email
                    inputgroup[3].value = contactitem.phone
                    dialog.setAttribute("currentedit", contactitem.id.toString())
                }
            }
        }
    }
}

/*
View contact doubleclick action
 */
export function openViewer(this: any) : void {
    let viewer : HTMLElement | null = document.querySelector(".contact-viewer")
    let placeholder : HTMLElement | null = document.querySelector(".placeholder")
    let contacteditor : HTMLElement | null = document.querySelector(".contact-editor")
    let viewerclosebtn : HTMLButtonElement | null = document.querySelector(".btn-close-viewer")
    if (viewer !== null && placeholder !== null && contacteditor !== null && viewerclosebtn !== null) {
        viewer.classList.remove("invisible")
        viewerclosebtn.classList.remove("invisible")
        placeholder.classList.add("invisible")
        contacteditor.classList.add("invisible")
    }
    let storage : HTMLButtonElement | boolean = getSelectedItem();
    if (typeof storage === "boolean") {
        console.error("Error while getting selected item for viewer")
    } else {
        let idstring : string | null = this.getAttribute("contactid")
        let storagekey : string = storage.innerText
        if (idstring !== null && storagekey !== null) {
            let id : number = Number.parseInt(idstring)
            let contactdata : Contact | boolean = getContactById(id,storagekey)
            let spans : NodeListOf<HTMLSpanElement> | null = document.querySelectorAll(".view-label")
            if (spans !== null && typeof contactdata !== "boolean") {
                spans[0].innerText = contactdata.firstname
                spans[1].innerText = contactdata.lastname
                spans[2].innerText = contactdata.email
                spans[3].innerText = contactdata.phone
            }
        }
    }
}

export function closeViewer() : void {
    let viewer : HTMLElement | null = document.querySelector(".contact-viewer")
    let placeholder : HTMLElement | null = document.querySelector(".placeholder")
    let contacteditor : HTMLElement | null = document.querySelector(".contact-editor")
    if (viewer !== null && placeholder !== null && contacteditor !== null) {
        viewer.classList.add("invisible")
        placeholder.classList.remove("invisible")
        contacteditor.classList.add("invisible")
    }
}