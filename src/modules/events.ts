/*
* central function to add all EventListeners to Buttons and other objects
* returns true if everything worked out fine, if not, there will be an error displayed as an alert
*/
import {createAddressbook, createContact, editContact} from "./storage";
import {
    closeAboutPopUp,
    closeAbPopUp,
    closeCreationDialog, closeViewer,
    deleteSelectedBook,
    deleteSelectedContacts, openAboutPopUp,
    openAbPopUp,
    openCreationDialog, openEditDialog
} from "./buttonlogic";
import {getSelectedItem} from "./reactivity";
import {Contact} from "./structs";
import {
    btnbookcreate,
    btncanceladdressbook,
    btncreatecontact,
    btndeletebook,
    btnsaveaddressbook,
    btnsaveedit,
    inputaddressbookname,
    inputformgroup,
    btnsavecontact,
    btncancelcontact,
    btndeletecontact,
    btneditcontact,
    btncloseviewer, btnopenabout, btncloseabout
} from "./static-elements";

export function createEventListeners(): boolean {
    try {
        /* Eventlisteners here */
        /*
        Handle the Create Book Button, open the popup and collect the name data to finally create the book.
        */
        if (btnbookcreate !== null) {
            btnbookcreate.addEventListener("click", () => {
                openAbPopUp();
            })
        }
        /*
        This function manages the save button on the popup, it uses a check for an empty string to make sure we
        do not save into LocalStorage with an empty key (although this would be possible, but it makes no sense)
         */
        if (inputaddressbookname !== null) {
            inputaddressbookname.addEventListener("input", (): void => {
                if (inputaddressbookname !== null && btnsaveaddressbook !== null) {
                    btnsaveaddressbook.disabled = inputaddressbookname.value == ""; //shorthand, button is disabled when the value is blank.
                }
            })
        }

        /*
        The popup save button, we first create the book based on the input, then hide the popup again
         */
        if (btnsaveaddressbook !== null) {
            btnsaveaddressbook.addEventListener("click", () => {
                if (inputaddressbookname !== null) {
                    createAddressbook(inputaddressbookname.value);
                    closeAbPopUp();
                    if (btnsaveaddressbook !== null) {
                        btnsaveaddressbook.disabled = true;
                    }
                    inputaddressbookname.value = "";
                }
            })
        }
        /*
        Basic logic, if the cancel button is pressed, we close the popup without further action
         */
        if (btncanceladdressbook !== null) {
            btncanceladdressbook.addEventListener("click", (): void => {
                closeAbPopUp();
                if (inputaddressbookname !== null) {
                    inputaddressbookname.value = "";
                }
                if (btnsaveaddressbook !== null) {
                    btnsaveaddressbook.disabled = true;
                }
            })
        }
        /*
        For deletion, we first need to enable a select functionality, which has to be refreshed on a regular basis
        This is implemented in reactivity, now we can add the deletion command
        */
        if (btndeletebook !== null) {
            btndeletebook.addEventListener("click", deleteSelectedBook)
        }
        /*
        Create an Eventlistener for the create button on the contact list
        */
        if (btncreatecontact !== null) {
            btncreatecontact.addEventListener("click", () => {
                openCreationDialog()
            })
        }
        /*
        Define the logic for the contact creation and edit form. First as well as last name along with ONE
        contact option. One contact form may be omitted.
         */
        if (inputformgroup !== null) {
            for (let i: number = 0; i < inputformgroup.length; i++) {
                inputformgroup[i].addEventListener("input", (): void => {
                    if (inputformgroup !== null && btnsavecontact !== null && btnsaveedit !== null && (inputformgroup[0].value !== "" && inputformgroup[1].value !== "" && (inputformgroup[2].value !== "" || inputformgroup[3].value !== "")) && inputformgroup[2].validity.valid && inputformgroup[3].validity.valid) {
                        btnsavecontact.disabled = false
                        btnsaveedit.disabled = false
                    } else if (btnsavecontact !== null && btnsaveedit !== null) {
                        btnsavecontact.disabled = true
                        btnsaveedit.disabled = true
                    }
                })
            }
        }

        /*
        Create the function that handles the save process on the contact create or edit form
         */
        if (btnsavecontact !== null) {
            btnsavecontact.addEventListener("click", (): void => {
                if (inputformgroup) {
                    let con: Contact = {
                        id: 0, //temporary, gets set by storage unit
                        firstname: inputformgroup[0].value,
                        lastname: inputformgroup[1].value,
                        email: inputformgroup[2].value,
                        phone: inputformgroup[3].value
                    }
                    let element: HTMLButtonElement | boolean = getSelectedItem();
                    if (typeof element === "boolean") {
                        alert("please select an addressbook.")
                        return
                    } else {
                        createContact(con, element.innerText);
                        closeCreationDialog();
                    }
                }
            })
        }
        /*
        Add the cancel button on the form to call the closeCreationDialog() function.
         */
        if (btncancelcontact !== null) {
            btncancelcontact.addEventListener("click", (): void => {
                closeCreationDialog()
            })
        }
        /*
        Add the contact delete button
         */
        if (btndeletecontact !== null) {
            btndeletecontact.addEventListener("click", deleteSelectedContacts)
        }
        /*
        Open the Editor for editing of the selected contact
         */
        if (btneditcontact !== null) {
            btneditcontact.addEventListener("click", (): void => {
                openEditDialog()
            })
        }
        /*
        Handle the logic of the edit save button
         */
        if (btnsaveedit !== null) {
            btnsaveedit.addEventListener("click", (): void => {
                let selectedab: HTMLButtonElement | boolean = getSelectedItem()
                if (typeof selectedab !== "boolean") {
                    let storage: string = selectedab.innerText
                    if (inputformgroup !== null) {
                        let contactId: HTMLElement | null = document.querySelector(".multiselect")
                        if (contactId !== null) {
                            let idstring: string | null = contactId.getAttribute("contactid")
                            if (idstring !== null) {
                                let finalid: number = Number.parseInt(idstring)
                                let rewrite: Contact = {
                                    id: finalid,
                                    firstname: inputformgroup[0].value,
                                    lastname: inputformgroup[1].value,
                                    email: inputformgroup[2].value,
                                    phone: inputformgroup[3].value
                                }
                                editContact(rewrite, storage)
                                closeCreationDialog() //does the same
                            }
                        }
                    }
                } else {
                    console.error("there was an error while getting the currently selected addressbook for this edit.")
                }
            })
        }
        /*
        Add the logic for the viewer close button. Keep in mind that it needs to be hidden and shown at
        the according places in the program.
         */

        if (btncloseviewer !== null) {
            btncloseviewer.addEventListener("click", (): void => {
                closeViewer()
            })
        }
        if (btnopenabout !== null) {
            btnopenabout.addEventListener("click", (): void => {
                openAboutPopUp()
            })
        }
        if (btncloseabout !== null) {
            btncloseabout.addEventListener("click", (): void => {
                closeAboutPopUp()
            })
        }
    } catch (e: any) { //any error may be catched here. That is why, for once, we use any here.
        console.error(e.message)
        return false
    }
    return true //Notify the main logic that the handlers were successfully added
}