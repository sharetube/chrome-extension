import React from "react";

interface ExpandProps {
    isExpended: boolean;
}

const Expand: React.FC<ExpandProps> = props => {
    if (!props.isExpended) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                className="pointer-events-none h-[100%] w-[100%] fill-current text-text-primary"
            >
                <path
                    clip-rule="evenodd"
                    d="M5.47 8.47c.293-.293.767-.293 1.06 0L12 13.94l5.47-5.47c.293-.293.767-.293 1.06 0 .293.293.293.767 0 1.06l-6 6-.53.53-.53-.53-6-6c-.293-.293-.293-.767 0-1.06Z"
                    fill-rule="evenodd"
                />
            </svg>
        );
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className="pointer-events-none h-[100%] w-[100%] fill-current text-text-primary"
        >
            <path
                clip-rule="evenodd"
                d="m13.06 9 5.47 5.47c.293.293.293.767 0 1.06-.293.293-.767.293-1.06 0L12 10.06l-5.47 5.47c-.293.293-.767.293-1.06 0-.293-.293-.293-.767 0-1.06L10.94 9l.53-.53.53-.53.53.53.53.53Z"
                fill-rule="evenodd"
            />
        </svg>
    );
};

export default Expand;
