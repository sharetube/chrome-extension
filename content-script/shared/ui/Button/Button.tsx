import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Children of the button (Icons)
     */
    children: React.ReactNode;
    /**
     * Function that will be called when the button is clicked
     */
    onClick?: () => void;
    /**
     * Additional classes for the button
     */
    className?: string;
}

// Wrapper for icons
const Button: React.FC<ButtonProps> = ({children, onClick, className, ...rest}) => {
    return (
        <button
            onClick={onClick}
            className={
                (className ? ` ${className}` : '') +
                ' m-0 box-border flex h-[40px] w-[36px] border-none bg-transparent p-0 text-text-primary hover:cursor-pointer'
            }
            {...rest}
        >
            <div className="m-auto h-[24px] w-[24px] fill-current">{children}</div>
        </button>
    );
};

export default Button;
