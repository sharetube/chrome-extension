import React from "react";

const SharedButton: React.FC = props => {
    return (
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[12px] outline outline-2 outline-spec-outline">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                className="h-[24px] w-[24px] fill-current text-text-primary"
            >
                <path d="M17.78 16c2.35 0 4.26-2.02 4.26-4.5S20.13 7 17.78 7H13v1h4.78c1.8 0 3.26 1.57 3.26 3.5S19.58 15 17.78 15H13v1h4.78zM11 15H6.19c-1.8 0-3.26-1.57-3.26-3.5S4.39 8 6.19 8H11V7H6.19c-2.35 0-4.26 2.02-4.26 4.5S3.84 16 6.19 16H11v-1zm5-4H8v1h8v-1z" />
            </svg>
        </div>
    );
};

export default SharedButton;
