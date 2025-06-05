

export function decorateUI(root){
    let currentMenu = ".arcane-container-item";
    let menuItems = root.querySelectorAll(currentMenu);

    menuItems.forEach(menuItem => {
        addIndicator(menuItem);
        menuItem.addEventListener("mouseenter", function () {
            let cursors = menuItem.querySelectorAll(".cursor");
            cursors.forEach(cursor => menuItem.removeChild(cursor));
            let oldIndicators = menuItem.querySelectorAll(".indicator");
            oldIndicators.forEach(indicator => menuItem.removeChild(indicator));
            menuItem.classList.add("active");
            addCursor(menuItem);
        });
        menuItem.addEventListener("mouseleave", function () {
            let cursors = menuItem.querySelectorAll(".cursor");
            cursors.forEach(cursor => menuItem.removeChild(cursor));
            addIndicator(menuItem);
            menuItem.classList.remove("active");
        });

        function addIndicator(menuItem) {
            let oldIndicators = menuItem.querySelectorAll(".indicator");
            oldIndicators.forEach(indicator => menuItem.removeChild(indicator));
            let cursors = menuItem.querySelectorAll(".cursor");
            cursors.forEach(cursor => menuItem.removeChild(cursor));
            let indicator = document.createElement("span");
            indicator.classList.add("indicator");
            indicator.innerText = "/ ";
            menuItem.prepend(indicator);
        }

        function addCursor(menuItem) {
            let cursor = document.createElement("span");
            cursor.innerText = "➜ ";
            cursor.classList.add("cursor");
            menuItem.prepend(cursor);
        }
    });

}
