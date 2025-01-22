import type React from "react";
import Icon from "../Icon/Icon";

const SearchIcon: React.FC = () => {
	return (
		<Icon>
			<path
				clipRule="evenodd"
				d="M16.296 16.996a8 8 0 11.707-.708l3.909 3.91-.707.707-3.909-3.909zM18 11a7 7 0 00-14 0 7 7 0 1014 0z"
				fillRule="evenodd"
			/>
		</Icon>
	);
};

export default SearchIcon;
