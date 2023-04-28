/*
Export elements that do not change on runtime:
= no books, contacts
= buttons
= viewers
 */
/*
Buttons
 */
export const btnbookcreate : HTMLButtonElement | null = document.querySelector(".btn-bookcreate");
export const btnsaveaddressbook : HTMLButtonElement | null = document.querySelector(".btn-pp-save");
export const btncanceladdressbook : HTMLButtonElement | null = document.querySelector(".btn-pp-cancel");
export const btndeletebook : HTMLButtonElement | null = document.querySelector(".btn-bookdelete");
export const btncreatecontact : HTMLButtonElement | null = document.querySelector(".btn-create-contact");
export const btnsavecontact : HTMLButtonElement | null = document.querySelector(".btn-save");
export const btncancelcontact : HTMLButtonElement | null = document.querySelector(".btn-cancel");
export const btnsaveedit : HTMLButtonElement | null = document.querySelector(".btn-edit-save");
export const btneditcontact : HTMLButtonElement | null = document.querySelector(".btn-edit-contact");
export const btndeletecontact : HTMLButtonElement | null = document.querySelector(".btn-delete-contact");
export const btncloseviewer : HTMLButtonElement | null = document.querySelector(".btn-close-viewer")
export const btnopenabout : HTMLButtonElement | null = document.querySelector(".btn-about")
export const btncloseabout : HTMLButtonElement | null = document.querySelector(".about-button")
/*
Buttongrouping
 */
export const btncloseviewwrapper : HTMLDivElement | null = document.querySelector(".buttongroup-close-view")
/*
Inputs & Labels
 */
export const inputaddressbookname : HTMLInputElement | null = document.querySelector("#addrname");
export const inputformgroup : NodeListOf<HTMLInputElement> | null = document.querySelectorAll(".form-input");
export const inputviewerlabels : NodeListOf<HTMLSpanElement> | null = document.querySelectorAll(".view-label");
/*
Viewers
 */
export const viewernamingbooks : HTMLDivElement | null = document.querySelector(".book-naming-popup");
export const viewereditcontact : HTMLElement | null = document.querySelector(".contact-editor");
export const viewerplaceholder : HTMLElement | null = document.querySelector(".placeholder");
export const viewershowcontact : HTMLElement | null = document.querySelector(".contact-viewer");
export const viewerabout : HTMLDivElement | null = document.querySelector(".about-popup");
/*
Containers
 */
export const containerbooks : HTMLDivElement | null = document.querySelector(".books-dyn");
export const containercontacts : HTMLDivElement | null = document.querySelector(".contact-contain");
/*
Other elements
 */
export const otherheadlinecreate : HTMLParagraphElement | null = document.querySelector(".action-create-headline");
export const otherheadlineedit : HTMLParagraphElement | null = document.querySelector(".action-edit-headline")
export const otherheadlineview : HTMLSpanElement | null = document.querySelector(".view-headline");
/*
Actions
 */
export const actioncall : HTMLButtonElement | null = document.querySelector(".viewer-shortcut-call");
export const actionemail : HTMLButtonElement | null = document.querySelector(".viewer-shortcut-email");