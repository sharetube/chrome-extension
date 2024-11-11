import React from "react";
import { createRoot } from "react-dom/client";

const render = (parent: Element | null, component: React.ReactNode): void => {
    if (!parent) return;

    const container = document.createElement("div");
    container.id = `st-container`;

    parent.prepend(container);

    const root = createRoot(container);
    root.render(component);
};

export default render;
