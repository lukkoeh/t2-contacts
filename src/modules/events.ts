/*
* central function to add all EventListeners to Buttons and other objects
* returns true if everything worked out fine, if not, there will be an error displayed as an alert
*/
import {createAddressbook, createContact, editContact} from "./storage";
import {
    closeAbPopUp,
    closeCreationDialog, closeViewer,
    deleteSelectedBook,
    deleteSelectedContacts,
    openAbPopUp,
    openCreationDialog, openEditDialog
} from "./buttonlogic";
import {getSelectedItem} from "./reactivity";
import {Contact} from "./structs";

export function createEventListeners() : boolean {
    try {
        /* Eventlisteners here */
        /*
        Handle the Create Book Button, open the popup and collect the name data to finally create the book.
        */
        let createbt : HTMLButtonElement | null = document.querySelector(".btn-bookcreate")
        if (createbt !== null) {
            createbt.addEventListener("click", ()=>{
                openAbPopUp();
            })
        }
        /*
        This function manages the save button on the popup, it uses a check for an empty string to make sure we
        do not save into LocalStorage with an empty key (although this would be possible, but it makes no sense)
         */
        let ppinput : HTMLInputElement | null = document.querySelector("#addrname")
        if (ppinput !== null) {
            ppinput.addEventListener("input", ()=>{
                let btn : HTMLButtonElement | null = document.querySelector(".btn-pp-save")
                if (ppinput !== null && btn !== null) {
                    btn.disabled = ppinput.value == ""; //shorthand, button is disabled when the value is blank.
                }
            })
        }

        /*
        The popup save button, we first create the book based on the input, then hide the popup again
         */
        let ppsave : HTMLButtonElement | null = document.querySelector(".btn-pp-save")
        if (ppsave !== null) {
            ppsave.addEventListener("click", ()=> {
                let ppinput : HTMLInputElement | null = document.querySelector("#addrname")
                if (ppinput !== null) {
                    createAddressbook(ppinput.value);
                    closeAbPopUp();
                    if (ppsave !== null) {
                        ppsave.disabled = true;
                    }
                    ppinput.value = "";
                }
            })
        }
        /*
        Basic logic, if the cancel button is pressed, we close the popup without further action
         */
        let ppcancel : HTMLButtonElement | null = document.querySelector(".btn-pp-cancel")
        if (ppcancel !== null) {
            ppcancel.addEventListener("click", ()=>{
                closeAbPopUp();
                if (ppinput !== null) {
                    ppinput.value = "";
                }
                if (ppsave !== null) {
                    ppsave.disabled = true;
                }
            })
        }
        /*
        For deletion, we first need to enable a select functionality, which has to be refreshed on a regular basis
        This is implemented in reactivity, now we can add the deletion command
        */
        let delbt : HTMLButtonElement | null = document.querySelector(".btn-bookdelete")
        if (delbt !== null) {
            delbt.addEventListener("click", deleteSelectedBook)
        }
        /*
        Create an Eventlistener for the create button on the contact list
        */
        let concreate: HTMLButtonElement | null = document.querySelector(".btn-create-contact")
        if (concreate !== null) {
            concreate.addEventListener("click", ()=> {
                openCreationDialog()
            })
        }
        /*
        Define the logic for the contact creation and edit form. First as well as last name along with ONE
        contact option. One contact form may be omitted.
         */
        let inputgroup : NodeListOf<HTMLInputElement> | null = document.querySelectorAll(".form-input")
        let svbt : HTMLButtonElement | null = document.querySelector(".btn-save")
        let editsvbt : HTMLButtonElement | null = document.querySelector(".btn-edit-save")
        if (inputgroup !== null) {
            for (let i: number = 0; i<inputgroup.length; i++) {
                inputgroup[i].addEventListener("input", ():void =>{
                    if (inputgroup!== null && svbt !== null && editsvbt !== null && (inputgroup[0].value !== "" && inputgroup[1].value !== "" && (inputgroup[2].value !== "" || inputgroup[3].value !== ""))) {
                        svbt.disabled = false
                        editsvbt.disabled = false
                    }
                    else if (svbt !== null && editsvbt !== null) {
                        svbt.disabled = true
                        editsvbt.disabled = true
                    }
                })
            }
        }

        /*
        Create the function that handles the save process on the contact create or edit form
         */
        let btnsavecontact : HTMLButtonElement | null = document.querySelector(".btn-save")
        if (btnsavecontact !== null) {
            btnsavecontact.addEventListener("click", () : void=>{
                if (inputgroup) {
                    let con: Contact = {
                        id: 0, //temporary, gets set by storage unit
                        firstname: inputgroup[0].value,
                        lastname: inputgroup[1].value,
                        phone: inputgroup[2].value,
                        email: inputgroup[3].value
                    }
                    let element : HTMLButtonElement | boolean = getSelectedItem();
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
        let clbtn : HTMLButtonElement | null = document.querySelector(".btn-cancel")
        if (clbtn !== null) {
            clbtn.addEventListener("click", () : void => {
                closeCreationDialog()
            })
        }
        /*
        Add the contact delete button
         */
        let delbtnc : HTMLButtonElement | null = document.querySelector(".btn-delete-contact")
        if (delbtnc !== null) {
            delbtnc.addEventListener("click", deleteSelectedContacts)
        }
        /*
        Open the Editor for editing of the selected contact
         */
        let editbtn : HTMLButtonElement | null = document.querySelector(".btn-edit-contact")
        if (editbtn !== null) {
            editbtn.addEventListener("click", () : void => {
                openEditDialog()
            })
        }
        /*
        Handle the logic of the edit save button
         */
        let editsavebutton : HTMLButtonElement | null = document.querySelector(".btn-edit-save")
        if (editsavebutton !== null) {
            editsavebutton.addEventListener("click", (): void => {
                let selectedab : HTMLButtonElement | boolean = getSelectedItem()
                if (typeof selectedab !== "boolean") {
                    let storage : string = selectedab.innerText
                    let inputgroup : NodeListOf<HTMLInputElement> | null = document.querySelectorAll(".form-input")
                    if (inputgroup !== null) {
                        let contactId : HTMLElement | null = document.querySelector(".multiselect")
                        if (contactId !== null) {
                            let idstring : string | null = contactId.getAttribute("contactid")
                            if (idstring !== null) {
                                let finalid : number = Number.parseInt(idstring)
                                let rewrite : Contact = {id: finalid, firstname: inputgroup[0].value, lastname: inputgroup[1].value, email: inputgroup[2].value, phone: inputgroup[3].value}
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
        let closeviewbtn : HTMLButtonElement | null = document.querySelector(".btn-close-viewer")
        if (closeviewbtn !== null) {
            closeviewbtn.addEventListener("click", () : void=>{
                closeViewer()
            })
        }
    } catch (e : any) { //any error may be catched here. That is why, for once, we use any here.
        console.error(e.message)
        return false
    }
    return true //Notify the main logic that the handlers were successfully added
}