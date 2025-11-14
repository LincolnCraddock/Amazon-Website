// call this function on a button click
// switches the currently displayed tab in the surrounding .tab-area to tabID
function changeTab(event, tabID) {
    
    const tabArea = event.currentTarget.closest(".tab-area");
    const tabContents = tabArea.getElementsByClassName("tab-content");
    for (const tabContent of tabContents)
        tabContent.style.display = tabContent.id == tabID ? "block" : "none";

    const tabs = tabArea.getElementsByClassName("tab");
    for (const tab of tabs) tab.classList.remove("active");
        event.currentTarget.classList.add("active");
}