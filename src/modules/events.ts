/*
* central function to add all EventListeners to Buttons and other objects
* returns true if everything worked out fine, if not, there will be an error displayed as an alert
*/
import {createAddressbook} from "./storage";
import {closeAbPopUp, deleteSelectedBook, openAbPopUp} from "./buttonlogic";

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
        do not save into LocalStorage with an empty key
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

    } catch (e : any) { //any error may be catched here. That is why, for once, we use any here.
        console.error(e.message)
        return false
    }
    return true //Notify the main logic that the handlers were successfully added
}