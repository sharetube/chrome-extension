import React from "react";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const Button: React.FC<ButtonProps> = ({ children, disabled, ...props }) => {
    return (
        <button
            className={`w-full border-none m-0 p-0 font-secondary text-[14px] text-center align-middle box-border h-[36px] bg-button-bg rounded-lg ${disabled ? "hover:cursor-default text-button-text-disabled" : "hover:cursor-pointer text-text-primary  "}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
