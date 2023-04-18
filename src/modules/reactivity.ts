export function updateBookShelf() : void {
    const container : Element | null = document.querySelector(".books-dyn");
    if (container !== null) {
        container.innerHTML = "";
        for (let i = 0; i<window.localStorage.length; i++) {
            let element = document.createElement('div')
            element.innerHTML = '<button class="element-bookshelf book ps20">' + localStorage.key(i) + "</button>"
            container.appendChild(element)
        }
    } else {
        console.error("unable to bind to container element")
        return;
    }
}