(function () {
    'use strict';

    /*
    This file contains functions which are outsourced from the events.ts module to keep the code more readable.
    If there is no special need to keep the functions inside the events module, they are here.
     */
    /*
    A function that opens up the Addressbook creation dialogue
     */
    function openAbPopUp() {
        const popup = document.querySelector(".book-naming-popup");
        if (popup !== null) {
            popup.classList.remove("invisible");
        }
    }
    /*
    The respective function to close the popup
     */
    function closeAbPopUp() {
        const popup = document.querySelector(".book-naming-popup");
        if (popup !== null) {
            popup.classList.add("invisible");
        }
    }
    /*
    This function handles the selection process. Essentially, the clicked item assigns itself as selected
    and removes all other instances of the selected class from other items.
     */
    function handleBookSelect() {
        this.classList.add("selected");
        printJsonAb(this.innerText);
        let btdel = document.querySelector(".btn-bookdelete");
        if (btdel !== null) {
            btdel.disabled = false;
        }
        let elements = document.querySelectorAll(".book");
        if (elements !== null) {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i] !== this) {
                    elements[i].classList.remove("selected");
                }
            }
        }
    }
    /*
    A function that deletes the book that is currently selected by the user. It utilizes the
    getSelected() function to find the correct entry and then calls the storage management
    to finally delete the entry via the localStorage API
     */
    function deleteSelectedBook() {
        let book2del = getSelectedItem();
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
            console.error("There was an error while finding the correct book, you may reselect or reload.");
        }
    }
    /*
    This function allows one to print a contact into the contacts-view, without implementing the logic multiple times
    But, it only takes a Contact Struct.
     */
    function spawnContact(print) {
        const container = document.querySelector(".contact-contain");
        if (container !== null) {
            let element = document.createElement('aside');
            element.setAttribute("contactid", print.id.toString());
            element.classList.add("contact-item");
            element.classList.add("ps30");
            let innerp = document.createElement("p");
            innerp.innerText = print.firstname + " " + print.lastname;
            element.appendChild(innerp);
            let innerp2 = document.createElement("p");
            if (print.email !== "") {
                innerp2.innerText = print.email;
            }
            else {
                innerp2.innerText = print.phone;
            }
            element.appendChild(innerp2);
            container.appendChild(element);
        }
    }
    /*
    Changes the visibility of the contact creation / edit form and in return hides all other
    forms from the edit area
     */
    function openCreationDialog() {
        let dialog = document.querySelector(".contact-editor");
        let placeholder = document.querySelector(".placeholder");
        let headlinecreate = document.querySelector(".action-create-headline");
        let headlineedit = document.querySelector(".action-edit-headline");
        let oldsvbtn = document.querySelector(".btn-save");
        let editsvbtn = document.querySelector(".btn-edit-save");
        let viewerbt = document.querySelector(".btn-close-viewer");
        let inputs = document.querySelectorAll(".form-input");
        if (inputs !== null) {
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = "";
            }
        }
        if (dialog !== null && placeholder !== null && headlinecreate !== null && headlineedit !== null && oldsvbtn !== null && editsvbtn !== null && viewerbt !== null) {
            viewerbt.classList.add("invisible");
            placeholder.classList.add("invisible");
            dialog.classList.remove("invisible");
            headlineedit.classList.add("invisible");
            headlinecreate.classList.remove("invisible");
            oldsvbtn.classList.remove("invisible");
            editsvbtn.classList.add("invisible");
        }
    }
    /*
    Function to be used to hide the edit or create form respectively, does NOT modify
    the headlines. Re-enables the placeholder
     */
    function closeCreationDialog() {
        let dialog = document.querySelector(".contact-editor");
        let placeholder = document.querySelector(".placeholder");
        let inputgroup = document.querySelectorAll(".form-input");
        if (dialog !== null && placeholder !== null && inputgroup !== null) {
            //first, switch the invisible class
            dialog.classList.add("invisible");
            placeholder.classList.remove("invisible");
            for (let i = 0; i < inputgroup.length; i++) {
                inputgroup[i].value = ""; //clear values
            }
        }
    }
    /*
    We need to prevent the fixIds() function from executing until all storage operations are done.
    That is why we toggle it here instead of in the storage module itself. We create a list of all items
    that should be deleted, then we cycle through, extract the IDs and delete the corresponding entries.
     */
    function deleteSelectedContacts() {
        let selectedab = document.querySelector(".selected");
        if (selectedab !== null) {
            let storagekey = selectedab.innerText;
            let it2d = document.querySelectorAll(".multiselect");
            for (let i = 0; i < it2d.length; i++) {
                let idstring = it2d[i].getAttribute("contactid");
                if (idstring !== null) {
                    let newid = Number.parseInt(idstring);
                    deleteContact(newid, storagekey);
                    closeViewer();
                }
            }
            fixIds(storagekey);
            restoreReactivityAb();
        }
    }
    /*
    Open up the editor and disable anything else.
    */
    function openEditDialog() {
        let dialog = document.querySelector(".contact-editor");
        let placeholder = document.querySelector(".placeholder");
        let headlinecreate = document.querySelector(".action-create-headline");
        let headlineedit = document.querySelector(".action-edit-headline");
        let editsvbtn = document.querySelector(".btn-edit-save");
        let oldsvbtn = document.querySelector(".btn-save");
        let viewclosebtn = document.querySelector(".btn-close-viewer");
        let viewer = document.querySelector(".contact-viewer");
        if (editsvbtn !== null && oldsvbtn !== null && viewclosebtn !== null) {
            editsvbtn.classList.remove("invisible");
            oldsvbtn.classList.add("invisible");
            viewclosebtn.classList.add("invisible");
        }
        if (dialog !== null && placeholder !== null && headlinecreate !== null && headlineedit !== null && viewer !== null) {
            placeholder.classList.add("invisible");
            dialog.classList.remove("invisible");
            headlineedit.classList.remove("invisible");
            headlinecreate.classList.add("invisible");
            viewer.classList.add("invisible");
        }
        let inputgroup = document.querySelectorAll(".form-input");
        let selectedcontact = document.querySelector(".multiselect"); //only first element
        let selectedab = document.querySelector(".selected");
        if (selectedcontact !== null && selectedab !== null) {
            let storagekey = selectedab.innerText;
            let contactid = selectedcontact.getAttribute("contactid");
            if (contactid !== null) {
                let finalid = Number.parseInt(contactid);
                let contactitem = getContactById(finalid, storagekey);
                if (typeof contactitem === "boolean") {
                    console.error("There was an error while getting the contact to prefill it into the form. Editing might not be possible");
                }
                else {
                    if (inputgroup !== null && dialog !== null) {
                        inputgroup[0].value = contactitem.firstname;
                        inputgroup[1].value = contactitem.lastname;
                        inputgroup[2].value = contactitem.email;
                        inputgroup[3].value = contactitem.phone;
                        dialog.setAttribute("currentedit", contactitem.id.toString());
                    }
                }
            }
        }
    }
    /*
    View contact doubleclick action
     */
    function openViewer() {
        let viewer = document.querySelector(".contact-viewer");
        let placeholder = document.querySelector(".placeholder");
        let contacteditor = document.querySelector(".contact-editor");
        let viewerclosebtn = document.querySelector(".btn-close-viewer");
        if (viewer !== null && placeholder !== null && contacteditor !== null && viewerclosebtn !== null) {
            viewer.classList.remove("invisible");
            viewerclosebtn.classList.remove("invisible");
            placeholder.classList.add("invisible");
            contacteditor.classList.add("invisible");
        }
        let storage = getSelectedItem();
        if (typeof storage === "boolean") {
            console.error("Error while getting selected item for viewer");
        }
        else {
            let idstring = this.getAttribute("contactid");
            let storagekey = storage.innerText;
            if (idstring !== null && storagekey !== null) {
                let id = Number.parseInt(idstring);
                let contactdata = getContactById(id, storagekey);
                let spans = document.querySelectorAll(".view-label");
                if (spans !== null && typeof contactdata !== "boolean") {
                    spans[0].innerText = contactdata.firstname;
                    spans[1].innerText = contactdata.lastname;
                    spans[2].innerText = contactdata.email;
                    spans[3].innerText = contactdata.phone;
                }
            }
        }
    }
    function closeViewer() {
        let viewer = document.querySelector(".contact-viewer");
        let placeholder = document.querySelector(".placeholder");
        let contacteditor = document.querySelector(".contact-editor");
        if (viewer !== null && placeholder !== null && contacteditor !== null) {
            viewer.classList.add("invisible");
            placeholder.classList.remove("invisible");
            contacteditor.classList.add("invisible");
        }
    }
    /*
    Create a function to show the About PopUp
     */
    function openAboutPopUp() {
        let popup = document.querySelector(".about-popup");
        if (popup !== null) {
            popup.style.right = "0";
        }
    }
    /*
    Create a function to hide the popup
     */
    function closeAboutPopUp() {
        let popup = document.querySelector(".about-popup");
        if (popup !== null) {
            popup.style.right = "-30%";
        }
    }

    /*
    This file contains functions to update various components of the site to mimic reactivity.
    Those functions are made to be called as often as the situation needs them to be called.
     */
    function updateBookShelf() {
        const container = document.querySelector(".books-dyn");
        if (container !== null) {
            container.innerHTML = "";
            for (let i = 0; i < window.localStorage.length; i++) {
                let element = document.createElement('div');
                element.innerHTML = '<button class="element-bookshelf book ps20">' + localStorage.key(i) + "</button>";
                container.appendChild(element);
            }
            restoreReactivityAb();
        }
        else {
            console.error("unable to bind to container element");
            return;
        }
    }
    /*
    Everytime a new object (contact, book) is created or rendered!, it has no event listener. We have to restore that.
    */
    function restoreReactivityAb() {
        let books = document.querySelectorAll(".book");
        for (let i = 0; i < books.length; i++) {
            books[i].addEventListener("click", handleBookSelect);
        }
        let contacts = document.querySelectorAll(".contact-item");
        if (contacts !== null) {
            for (let i = 0; i < contacts.length; i++) {
                contacts[i].addEventListener("click", toggleMultiSelect);
                contacts[i].addEventListener("dblclick", openViewer);
            }
        }
        handleButtonDisable();
    }
    /*
    A function to get the currently selected item.
     */
    function getSelectedItem() {
        let elements = document.querySelectorAll(".book");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains("selected")) {
                return elements[i];
            }
        }
        console.error("tried to access non existent selected item. If you are a developer you may check...");
        return false;
    }
    /*
    Print an addressbook into the contactlist using its storagekey
     */
    function printJsonAb(storagekey) {
        let storage = localStorage.getItem(storagekey);
        if (storage !== null) {
            // First, clear the contact list
            let list = document.querySelector(".contact-contain");
            if (list !== null) {
                list.innerHTML = ""; // reset the container
            }
            let tmp = JSON.parse(storage);
            if (Object.keys(tmp).length === 0) {
                return;
            }
            // If our JSON is blank, we dont need to print a html div
            for (let i = 0; i < Object.keys(tmp).length; i++) {
                let newcontact = {
                    id: tmp[i].id,
                    firstname: tmp[i].firstname,
                    lastname: tmp[i].lastname,
                    email: tmp[i].email,
                    phone: tmp[i].phone
                }; // create a new contact object
                // After contact creation, spawn it
                spawnContact(newcontact);
            }
            restoreReactivityAb();
        }
    }
    /*
    Function to add the multiselect class to clicked items, it uses a toggle logic
    */
    function toggleMultiSelect() {
        if (this.classList.contains("multiselect")) {
            this.classList.remove("multiselect");
            handleButtonDisable();
        }
        else {
            this.classList.add("multiselect");
            handleButtonDisable();
        }
    }
    /*
    Checker function to check if any item is selected, if its more than 1, disable the edit button, if more than 1, enable the
    delete button, if its exactly 1, enable the edit button, if its 0, just disable everything.
     */
    function handleButtonDisable() {
        let buttonedit = document.querySelector(".btn-edit-contact");
        let buttondelete = document.querySelector(".btn-delete-contact");
        let elements = document.querySelectorAll(".multiselect");
        if (buttonedit !== null && buttondelete !== null) {
            if (elements.length === 0) {
                buttonedit.disabled = true;
                buttondelete.disabled = true;
            }
            else if (elements.length === 1) {
                buttonedit.disabled = false;
                buttondelete.disabled = false;
            }
            else if (elements.length > 1) {
                buttonedit.disabled = true;
                buttondelete.disabled = false;
            }
        }
    }

    /*
    * TypeScript Logic to handle all LocalStorage Operations, needs the contact interface
    */
    /*
    Creates an Addressbook in Localstorage with the name specified in its parameter and an empty JSON array.
     */
    function createAddressbook(name) {
        /* First, check if the desired item already exists */
        if (localStorage.getItem(name) !== null) {
            alert("Addressbook could not be created. Reason: already exists");
            return false;
        }
        localStorage.setItem(name, "[]"); //create the item with an empty JSON array
        //update the view.
        updateBookShelf();
        restoreReactivityAb();
        return true;
    }
    /*
    This function takes a key in form of a string and deletes the respective Storage entry.
     */
    function deleteAddressbookByKey(key) {
        localStorage.removeItem(key);
    }
    /*
    Function that creates a contact and writes it to memory. Keep in mind that the contact object has to
    be created prior using the contact interface defined in structs.ts
     */
    function createContact(newcontact, storagekey) {
        let storage = localStorage.getItem(storagekey);
        if (storage !== null) {
            let json = JSON.parse(storage);
            let jsonadd = { id: json.length, firstname: newcontact.firstname, lastname: newcontact.lastname, phone: newcontact.phone, email: newcontact.email };
            json.push(jsonadd);
            let newstorage = JSON.stringify(json);
            localStorage.setItem(storagekey, newstorage);
            fixIds(storagekey);
        }
    }
    /*
    The respective function that reads the contacts out of the localStorage and deletes it.
    Uses full dataset comparison to always delete the correct entry without needing to implement IDs.
     */
    function deleteContact(id, storagekey) {
        let storage = localStorage.getItem(storagekey);
        if (storage !== null) {
            let json = JSON.parse(storage);
            for (let i = 0; i < json.length; i++) {
                if (json[i].id === id) {
                    json.splice(i, 1);
                    localStorage.setItem(storagekey, JSON.stringify(json));
                    return;
                }
            }
            console.error("There was an error while searching the correct entry to DELETE");
            return;
        }
        else {
            console.error("The requested localStorage Item was not accessible. As a developer you should check the code.");
            return;
        }
    }
    /*
    Every time, a contact is created or deleted, the fixIds function fixes up the order of the IDs in the array
    and re renders the whole Addressbook with the correct ids
     */
    function fixIds(storagekey) {
        let storage = localStorage.getItem(storagekey);
        if (storage !== null) {
            let json = JSON.parse(storage);
            for (let i = 0; i < json.length; i++) {
                json[i].id = i;
            }
            localStorage.setItem(storagekey, JSON.stringify(json));
            printJsonAb(storagekey);
        }
    }
    /*
    Create a function to essentially override a contact with a new version of itself, we do this by giving a function
    our new contact, and we will extract the id to find the entry and replace it
     */
    function editContact(newcontact, storagekey) {
        let storage = localStorage.getItem(storagekey);
        if (storage !== null) {
            let json = JSON.parse(storage);
            for (let i = 0; i < json.length; i++) {
                if (json[i].id === newcontact.id) {
                    json[i].firstname = newcontact.firstname;
                    json[i].lastname = newcontact.lastname;
                    json[i].email = newcontact.email;
                    json[i].phone = newcontact.phone;
                }
            }
            localStorage.setItem(storagekey, JSON.stringify(json));
            printJsonAb(storagekey);
        }
    }
    function getContactById(id, storagekey) {
        let storage = localStorage.getItem(storagekey);
        if (storage !== null) {
            let json = JSON.parse(storage);
            for (let i = 0; i < json.length; i++) {
                if (json[i].id === id) {
                    return {
                        id: json[i].id,
                        firstname: json[i].firstname,
                        lastname: json[i].lastname,
                        email: json[i].email,
                        phone: json[i].phone
                    };
                }
            }
        }
        return false;
    }

    /*
    * central function to add all EventListeners to Buttons and other objects
    * returns true if everything worked out fine, if not, there will be an error displayed as an alert
    */
    function createEventListeners() {
        try {
            /* Eventlisteners here */
            /*
            Handle the Create Book Button, open the popup and collect the name data to finally create the book.
            */
            let createbt = document.querySelector(".btn-bookcreate");
            if (createbt !== null) {
                createbt.addEventListener("click", () => {
                    openAbPopUp();
                });
            }
            /*
            This function manages the save button on the popup, it uses a check for an empty string to make sure we
            do not save into LocalStorage with an empty key (although this would be possible, but it makes no sense)
             */
            let ppinput = document.querySelector("#addrname");
            if (ppinput !== null) {
                ppinput.addEventListener("input", () => {
                    let btn = document.querySelector(".btn-pp-save");
                    if (ppinput !== null && btn !== null) {
                        btn.disabled = ppinput.value == ""; //shorthand, button is disabled when the value is blank.
                    }
                });
            }
            /*
            The popup save button, we first create the book based on the input, then hide the popup again
             */
            let ppsave = document.querySelector(".btn-pp-save");
            if (ppsave !== null) {
                ppsave.addEventListener("click", () => {
                    let ppinput = document.querySelector("#addrname");
                    if (ppinput !== null) {
                        createAddressbook(ppinput.value);
                        closeAbPopUp();
                        if (ppsave !== null) {
                            ppsave.disabled = true;
                        }
                        ppinput.value = "";
                    }
                });
            }
            /*
            Basic logic, if the cancel button is pressed, we close the popup without further action
             */
            let ppcancel = document.querySelector(".btn-pp-cancel");
            if (ppcancel !== null) {
                ppcancel.addEventListener("click", () => {
                    closeAbPopUp();
                    if (ppinput !== null) {
                        ppinput.value = "";
                    }
                    if (ppsave !== null) {
                        ppsave.disabled = true;
                    }
                });
            }
            /*
            For deletion, we first need to enable a select functionality, which has to be refreshed on a regular basis
            This is implemented in reactivity, now we can add the deletion command
            */
            let delbt = document.querySelector(".btn-bookdelete");
            if (delbt !== null) {
                delbt.addEventListener("click", deleteSelectedBook);
            }
            /*
            Create an Eventlistener for the create button on the contact list
            */
            let concreate = document.querySelector(".btn-create-contact");
            if (concreate !== null) {
                concreate.addEventListener("click", () => {
                    openCreationDialog();
                });
            }
            /*
            Define the logic for the contact creation and edit form. First as well as last name along with ONE
            contact option. One contact form may be omitted.
             */
            let inputgroup = document.querySelectorAll(".form-input");
            let svbt = document.querySelector(".btn-save");
            let editsvbt = document.querySelector(".btn-edit-save");
            if (inputgroup !== null) {
                for (let i = 0; i < inputgroup.length; i++) {
                    inputgroup[i].addEventListener("input", () => {
                        if (inputgroup !== null && svbt !== null && editsvbt !== null && (inputgroup[0].value !== "" && inputgroup[1].value !== "" && (inputgroup[2].value !== "" || inputgroup[3].value !== ""))) {
                            svbt.disabled = false;
                            editsvbt.disabled = false;
                        }
                        else if (svbt !== null && editsvbt !== null) {
                            svbt.disabled = true;
                            editsvbt.disabled = true;
                        }
                    });
                }
            }
            /*
            Create the function that handles the save process on the contact create or edit form
             */
            let btnsavecontact = document.querySelector(".btn-save");
            if (btnsavecontact !== null) {
                btnsavecontact.addEventListener("click", () => {
                    if (inputgroup) {
                        let con = {
                            id: 0,
                            firstname: inputgroup[0].value,
                            lastname: inputgroup[1].value,
                            phone: inputgroup[2].value,
                            email: inputgroup[3].value
                        };
                        let element = getSelectedItem();
                        if (typeof element === "boolean") {
                            alert("please select an addressbook.");
                            return;
                        }
                        else {
                            createContact(con, element.innerText);
                            closeCreationDialog();
                        }
                    }
                });
            }
            /*
            Add the cancel button on the form to call the closeCreationDialog() function.
             */
            let clbtn = document.querySelector(".btn-cancel");
            if (clbtn !== null) {
                clbtn.addEventListener("click", () => {
                    closeCreationDialog();
                });
            }
            /*
            Add the contact delete button
             */
            let delbtnc = document.querySelector(".btn-delete-contact");
            if (delbtnc !== null) {
                delbtnc.addEventListener("click", deleteSelectedContacts);
            }
            /*
            Open the Editor for editing of the selected contact
             */
            let editbtn = document.querySelector(".btn-edit-contact");
            if (editbtn !== null) {
                editbtn.addEventListener("click", () => {
                    openEditDialog();
                });
            }
            /*
            Handle the logic of the edit save button
             */
            let editsavebutton = document.querySelector(".btn-edit-save");
            if (editsavebutton !== null) {
                editsavebutton.addEventListener("click", () => {
                    let selectedab = getSelectedItem();
                    if (typeof selectedab !== "boolean") {
                        let storage = selectedab.innerText;
                        let inputgroup = document.querySelectorAll(".form-input");
                        if (inputgroup !== null) {
                            let contactId = document.querySelector(".multiselect");
                            if (contactId !== null) {
                                let idstring = contactId.getAttribute("contactid");
                                if (idstring !== null) {
                                    let finalid = Number.parseInt(idstring);
                                    let rewrite = { id: finalid, firstname: inputgroup[0].value, lastname: inputgroup[1].value, email: inputgroup[2].value, phone: inputgroup[3].value };
                                    editContact(rewrite, storage);
                                    closeCreationDialog(); //does the same
                                }
                            }
                        }
                    }
                    else {
                        console.error("there was an error while getting the currently selected addressbook for this edit.");
                    }
                });
            }
            /*
            Add the logic for the viewer close button. Keep in mind that it needs to be hidden and shown at
            the according places in the program.
             */
            let closeviewbtn = document.querySelector(".btn-close-viewer");
            if (closeviewbtn !== null) {
                closeviewbtn.addEventListener("click", () => {
                    closeViewer();
                });
            }
            let aboutbtn = document.querySelector(".btn-about");
            if (aboutbtn !== null) {
                aboutbtn.addEventListener("click", () => {
                    openAboutPopUp();
                });
            }
            let aboutclosebtn = document.querySelector(".about-button");
            if (aboutclosebtn !== null) {
                aboutclosebtn.addEventListener("click", () => {
                    closeAboutPopUp();
                });
            }
        }
        catch (e) { //any error may be catched here. That is why, for once, we use any here.
            console.error(e.message);
            return false;
        }
        return true; //Notify the main logic that the handlers were successfully added
    }

    /* on startup, call createEventListeners to initialize the app */
    document.addEventListener("DOMContentLoaded", () => {
        let loaded = createEventListeners();
        if (!loaded) {
            alert("App initialization failed, please refer to the console for details.");
        }
        // Start by creating the bookshelf, but only on first run
        if (window.localStorage.length === 0) {
            createAddressbook("Default Shitbook");
        }
        else { //if there are already books, just update the bookshelf
            updateBookShelf();
        }
    });

})();
