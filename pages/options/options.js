const checkbox = document.querySelector("input#devmode");

chrome.runtime.sendMessage({ type: "GET_DEVMODE" }).then(value => {
    if (checkbox) {
        checkbox.checked = value;
    }
});

checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    chrome.runtime.sendMessage({ type: "SET_DEVMODE", payload: isChecked });
});
