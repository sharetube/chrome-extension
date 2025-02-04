import type React from "react";
import Icon from "../Icon/Icon";
import TopIcon from "../TopIcon/TopIcon";

interface ExpandProps {
	isExpanded: boolean;
}

const ExpandIcon: React.FC<ExpandProps> = (props) => {
	if (!props.isExpanded) {
		return (
			<Icon>
				<path d="M7.41 8.58008L12 13.17L16.59 8.58008L18 10.0001L12 16.0001L6 10.0001L7.41 8.58008Z" />
			</Icon>
		);
	}
	return <TopIcon />;
};

export default ExpandIcon;
