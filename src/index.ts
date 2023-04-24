import {createEventListeners} from "./modules/events";
import {createAddressbook} from "./modules/storage";
import {updateBookShelf} from "./modules/reactivity";

/* on startup, call createEventListeners to initialize the app */

document.addEventListener("DOMContentLoaded", ()=> {
    let loaded : boolean = createEventListeners();
    if(!loaded) {
        alert("App initialization failed, please refer to the console for details.")
    }
    // Start by creating the bookshelf, but only on first run
    if (window.localStorage.length === 0) {
        createAddressbook("Default");
    } else { //if there are already books, just update the bookshelf to render
        updateBookShelf();
    }
});