import Icon from "../Icon/Icon";
import Top from "../Top/Top";
import React from "react";

interface ExpandProps {
    isExpended: boolean;
}

const Expand: React.FC<ExpandProps> = props => {
    if (!props.isExpended) {
        return (
            <Icon>
                <path d="M7.41 8.58008L12 13.17L16.59 8.58008L18 10.0001L12 16.0001L6 10.0001L7.41 8.58008Z" />
            </Icon>
        );
    }
    return <Top />;
};

export default Expand;
