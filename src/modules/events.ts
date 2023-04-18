/*
* central function to add all EventListeners to Buttons and other objects
* returns true if everything worked out fine, if not, there will be an error displayed as an alert
*/
import {createAddressbook} from "./storage";
import {closeAbPopUp, openAbPopUp} from "./buttonlogic";

export function createEventListeners() : boolean {
    try {
        /* Eventlisteners here */
        let createbt : HTMLButtonElement | null = document.querySelector(".btn-bookcreate")
        if (createbt !== null) {
            createbt.addEventListener("click", ()=>{
                openAbPopUp();
            })
        }
        let ppinput : HTMLInputElement | null = document.querySelector("#addrname")
        if (ppinput !== null) {
            ppinput.addEventListener("input", ()=>{
                let btn : HTMLButtonElement | null = document.querySelector(".btn-pp-save")
                if (ppinput !== null && btn !== null) {
                    btn.disabled = ppinput.value === "";
                }
            })
        }
        let ppcancel : HTMLButtonElement | null = document.querySelector(".btn-pp-cancel")
        if (ppcancel !== null) {
            ppcancel.addEventListener("click", ()=>{
                closeAbPopUp();
            })
        }
        let ppsave : HTMLButtonElement | null = document.querySelector(".btn-pp-save")
        if (ppsave !== null) {
            ppsave.addEventListener("click", ()=> {
                let ppinput : HTMLInputElement | null = document.querySelector("#addrname")
                if (ppinput !== null) {
                    createAddressbook(ppinput.value);
                    closeAbPopUp();
                }
            })
        }
    } catch (e : any) { //any error may be catched here.
        console.error(e.message)
        return false
    }
    return true
}