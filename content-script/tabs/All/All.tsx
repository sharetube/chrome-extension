import waitForElement from "@shared/lib/waitForElement";
import Popup from "@widgets/Popup/Popup";
import ReactDOM from "react-dom";

// Render popup
waitForElement("#end")
    .then(elem => {
        const container = document.createElement("div");
        elem?.prepend(container);
        ReactDOM.render(<Popup />, container);
    })
    .catch(error => console.error("Failed to render popup", error));
