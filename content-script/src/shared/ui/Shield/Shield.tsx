import React from "react";

const Shield: React.FC = () => {
    return (
        <svg
            width="36"
            height="44"
            viewBox="0 0 36 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none h-[100%] w-[100%] fill-current"
        >
            <path
                d="M18 42C18 42 34 34 34 22V8L18 2L2 8V22C2 34 18 42 18 42Z"
                fill="black"
                stroke="black"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};

export default Shield;
