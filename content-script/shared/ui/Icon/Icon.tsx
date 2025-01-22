import type React from "react";

interface IconProps {
	/**
	 * Children of the icon
	 */
	children: React.ReactNode;
}

const Icon: React.FC<IconProps> = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			focusable="false"
			aria-hidden="true"
			className="pointer-events-none h-[100%] w-[100%] fill-current"
		>
			{props.children}
		</svg>
	);
};

export default Icon;
