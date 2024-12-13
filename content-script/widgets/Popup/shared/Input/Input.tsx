import React from 'react';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;

const Input: React.FC<InputProps> = props => {
    return (
        <input
            className="box-border h-[46px] w-full rounded-lg outline-none text-text-primary bg-transparent font-secondary font-normal focus:bg-transparent target:bg-transparent border-solid border border-spec-outline p-[11px_0_11px_16px] m-0"
            {...props}
        />
    );
};

export default Input;
