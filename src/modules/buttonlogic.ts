/*
This file contains functions which are outsourced from the events.ts module to keep the code more readable.
If there is no special need to keep the functions inside the events module, they are here.
 */
import {abDeletionHook, getSelectedItem, printJsonAb, restoreReactivityAb} from "./reactivity";
import {createContact, deleteAddressbookByKey, deleteContact, fixIds, getContactById} from "./storage";
import {Contact} from "./structs";
import {
    actioncall, actionemail,
    btncloseviewer, btncloseviewwrapper,
    btndeletebook,
    btnsavecontact, btnsaveedit,
    containercontacts,
    inputformgroup, inputviewerlabels, otherheadlinecreate, otherheadlineedit, otherheadlineview, viewerabout,
    viewereditcontact,
    viewernamingbooks, viewerplaceholder, viewershowcontact
} from "./static-elements";

/*
A function that opens up the Addressbook creation dialogue
 */
export function openAbPopUp(): void {
    if (viewernamingbooks !== null) {
        viewernamingbooks.classList.remove("invisible");
    }
}

/*
The respective function to close the popup
 */
export function closeAbPopUp(): void {
    if (viewernamingbooks !== null) {
        viewernamingbooks.classList.add("invisible");
    }
}

/*
This function handles the selection process. Essentially, the clicked item assigns itself as selected
and removes all other instances of the selected class from other items.
 */
export function handleBookSelect(this: any): void { /* Any is used because of this not being typed. */
    this.classList.add("selected")
    printJsonAb(this.innerText);
    if (btndeletebook !== null) {
        btndeletebook.disabled = false;
    }
    let elements: NodeListOf<HTMLButtonElement> | null = document.querySelectorAll(".book")
    if (elements !== null) {
        for (let i: number = 0; i < elements.length; i++) {
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
export function deleteSelectedBook(this: any): void { //any = instance of delete button
    let book2del: HTMLButtonElement | boolean = getSelectedItem()
    if (typeof book2del !== "boolean") {
        let key: string = book2del.innerHTML;
        deleteAddressbookByKey(key);
        if (book2del.parentNode !== null) {
            book2del.parentNode.removeChild(book2del); //It quite literally deletes itself XD
        }
        if (localStorage.length === 0) {
            this.disabled = true;
        }
        abDeletionHook();
    } else {
        console.error("There was an error while finding the correct book, you may reselect or reload.")
    }
}

/*
This function allows one to print a contact into the contacts-view, without implementing the logic multiple times
But, it only takes a Contact Struct.
 */
export function spawnContact(print: Contact): void {
    if (containercontacts !== null) {
        let element: HTMLElement = document.createElement('aside')
        element.setAttribute("draggable", "true")
        element.setAttribute("contactid", print.id.toString())
        element.classList.add("contact-item")
        element.classList.add("ps30")
        let innerp: HTMLParagraphElement = document.createElement("p")
        innerp.innerText = print.firstname + " " + print.lastname
        element.appendChild(innerp)
        let innerp2: HTMLParagraphElement = document.createElement("p")
        if (print.email !== "") {
            innerp2.innerText = print.email
        } else {
            innerp2.innerText = print.phone
        }
        element.appendChild(innerp2)
        containercontacts.appendChild(element)
    }
}

/*
Changes the visibility of the contact creation / edit form and in return hides all other
forms from the edit area
 */
export function openCreationDialog(): void {
    if (inputformgroup !== null) {
        for (let i: number = 0; i < inputformgroup.length; i++) {
            inputformgroup[i].value = "";
        }
    }
    if (viewereditcontact !== null && viewerplaceholder !== null && otherheadlinecreate !== null && otherheadlineedit !== null && btnsavecontact !== null && btnsaveedit !== null && btncloseviewwrapper !== null) {
        btncloseviewwrapper.classList.add("invisible")
        viewerplaceholder.classList.add("invisible")
        viewereditcontact.classList.remove("invisible")
        otherheadlineedit.classList.add("invisible")
        otherheadlinecreate.classList.remove("invisible")
        btnsavecontact.classList.remove("invisible")
        btnsaveedit.classList.add("invisible")
    }
}

/*
Function to be used to hide the edit or create form respectively, does NOT modify
the headlines. Re-enables the placeholder
 */
export function closeCreationDialog(): void {
    if (viewereditcontact !== null && viewerplaceholder !== null && inputformgroup !== null) {
        //first, switch the invisible class
        viewereditcontact.classList.add("invisible")
        viewerplaceholder.classList.remove("invisible")
        for (let i: number = 0; i < inputformgroup.length; i++) {
            inputformgroup[i].value = ""; //clear values
        }
    }

}

/*
We need to prevent the fixIds() function from executing until all storage operations are done.
That is why we toggle it here instead of in the storage module itself. We create a list of all items
that should be deleted, then we cycle through, extract the IDs and delete the corresponding entries.
 */
export function deleteSelectedContacts(this: any): void {
    let selectedab: HTMLButtonElement | null = document.querySelector(".selected")
    if (selectedab !== null) {
        let storagekey: string = selectedab.innerText
        let it2d: NodeListOf<HTMLElement> | null = document.querySelectorAll(".multiselect")
        for (let i: number = 0; i < it2d.length; i++) {
            let idstring: string | null = it2d[i].getAttribute("contactid")
            if (idstring !== null) {
                let newid: number = Number.parseInt(idstring)
                deleteContact(newid, storagekey)
                closeViewer()
            }
        }
        fixIds(storagekey)
        restoreReactivityAb()
    }
}

/*
Open up the editor and disable anything else.
*/
export function openEditDialog(): void {
    if (btnsaveedit !== null && btnsavecontact !== null && btncloseviewwrapper !== null) {
        btnsaveedit.classList.remove("invisible")
        btnsavecontact.classList.add("invisible")
        btncloseviewwrapper.classList.add("invisible")
    }
    if (viewereditcontact !== null && viewerplaceholder !== null && otherheadlinecreate !== null && otherheadlineedit !== null && viewershowcontact !== null) {
        viewerplaceholder.classList.add("invisible")
        viewereditcontact.classList.remove("invisible")
        otherheadlineedit.classList.remove("invisible")
        otherheadlinecreate.classList.add("invisible")
        viewershowcontact.classList.add("invisible")
    }
    const selectedcontact: HTMLElement | null = document.querySelector(".multiselect") //only first element
    const selectedab: HTMLButtonElement | null = document.querySelector(".selected")
    if (selectedcontact !== null && selectedab !== null) {
        let storagekey: string = selectedab.innerText;
        let contactid: string | null = selectedcontact.getAttribute("contactid")
        if (contactid !== null) {
            let finalid: number = Number.parseInt(contactid)
            let contactitem: Contact | boolean = getContactById(finalid, storagekey)
            if (typeof contactitem === "boolean") {
                console.error("There was an error while getting the contact to prefill it into the form. Editing might not be possible")
            } else {
                if (inputformgroup !== null && viewereditcontact !== null) {
                    inputformgroup[0].value = contactitem.firstname
                    inputformgroup[1].value = contactitem.lastname
                    inputformgroup[2].value = contactitem.email
                    inputformgroup[3].value = contactitem.phone
                    viewereditcontact.setAttribute("currentedit", contactitem.id.toString())
                }
            }
        }
    }
}

/*
View contact doubleclick action
 */
export function openViewer(this: any): void {
    if (viewershowcontact !== null && viewerplaceholder !== null && viewereditcontact !== null && btncloseviewer !== null) {
        viewershowcontact.classList.remove("invisible")
        btncloseviewwrapper?.classList.remove("invisible");
        viewerplaceholder.classList.add("invisible")
        viewereditcontact.classList.add("invisible")
    }
    let storage: HTMLButtonElement | boolean = getSelectedItem();
    if (typeof storage === "boolean") {
        console.error("Error while getting selected item for viewer")
    } else {
        let idstring: string | null = this.getAttribute("contactid")
        let storagekey: string = storage.innerText
        if (idstring !== null && storagekey !== null) {
            let id: number = Number.parseInt(idstring)
            let contactdata: Contact | boolean = getContactById(id, storagekey)
            if (inputviewerlabels !== null && typeof contactdata !== "boolean" && otherheadlineview !== null && actioncall !== null && actionemail !== null) {
                otherheadlineview.innerText = contactdata.firstname + " " + contactdata.lastname
                inputviewerlabels[0].innerText = contactdata.firstname
                inputviewerlabels[1].innerText = contactdata.lastname
                inputviewerlabels[2].innerText = contactdata.email
                inputviewerlabels[3].innerText = contactdata.phone
                if (contactdata.email != "") {
                    actionemail.setAttribute("onclick", "window.location.href='mailto:" + contactdata.email + "'")
                    actionemail.removeAttribute("disabled")
                } else {
                    actionemail.setAttribute("disabled", "true")
                }
                if (contactdata.phone != "") {
                    actioncall.setAttribute("href", "window.location.href='phone:" + contactdata.phone + "'")
                    actioncall.removeAttribute("disabled")
                } else {
                    actioncall.setAttribute("disabled", "true")
                }
            }
        }
    }
}

export function closeViewer(): void {
    if (viewershowcontact !== null && viewerplaceholder !== null && viewereditcontact !== null && btncloseviewwrapper !== null) {
        viewershowcontact.classList.add("invisible")
        viewerplaceholder.classList.remove("invisible")
        viewereditcontact.classList.add("invisible")
        btncloseviewwrapper.classList.add("invisible")
    }
}

/*
Create a function to show the About PopUp
 */
export function openAboutPopUp(): void {
    if (viewerabout !== null) {
        viewerabout.style.right = "0"
    }
}

/*
Create a function to hide the popup
 */
export function closeAboutPopUp(): void {
    if (viewerabout !== null) {
        viewerabout.style.right = "-30%"
    }
}

/*
Create a function to handle drag and drop feature
 */
export function handleContactDrag(this: any, ev: DragEvent): void {
    this.classList.add("multiselect")
    let mselements: NodeListOf<HTMLButtonElement> | null = document.querySelectorAll(".multiselect")
    let ids: string[] = []
    if (mselements !== null) {
        for (let i: number = 0; i < mselements.length; i++) {
            let idtmp: string | null = mselements[i].getAttribute("contactid")
            if (idtmp !== null) {
                ids.push(idtmp)
            }
        }
        if (ev.dataTransfer !== null) {
            ev.dataTransfer.dropEffect = "move"
            let storage: boolean | HTMLButtonElement = getSelectedItem()
            if (typeof storage !== "boolean") {
                let key: string = storage.innerText
                let obj: { cid: string[], sk: string } = {cid: ids, sk: key}
                ev.dataTransfer.setData("text/plain", JSON.stringify(obj))
            }
        }
    }
}

/*
see above
 */
export function handleContactDrop(this: any, ev: DragEvent): void {
    ev.preventDefault()
    if (ev.dataTransfer !== null) {
        const data: string = ev.dataTransfer.getData("text/plain")
        let result: { cid: string[], sk: string } = JSON.parse(data)
        let newstorage: string = this.innerText;
        // perform transfer
        for (let i: number = 0; i < result.cid.length; i++) {
            let contacttmp: Contact | boolean = getContactById(Number.parseInt(result.cid[i]), result.sk)
            if (typeof contacttmp !== "boolean") {
                deleteContact(contacttmp.id, result.sk)
                createContact(contacttmp, newstorage)
            }
        }
        printJsonAb(result.sk)
    }
    (ev.target as HTMLButtonElement).classList.remove("draggedover")
}