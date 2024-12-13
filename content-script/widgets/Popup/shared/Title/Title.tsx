import React from 'react';

interface TextProps {
    children: string;
}

const Title: React.FC<TextProps> = ({children}) => {
    return (
        <p className="text-text-secondary font-secondary text-[15px] leading-6 m-[0_0_2px]">
            {children}
        </p>
    );
};

export default Title;
