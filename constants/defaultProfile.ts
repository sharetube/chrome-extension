import type { ProfileType } from "../types/profile.type";
import { colors } from "./colors";

function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}

export function getDefaultProfile(): ProfileType {
	return {
		color: getRandomColor(),
		avatar_url: "",
		username: "User",
	};
}

export const defaultProfile: ProfileType = {
	color: colors[0],
	avatar_url: "",
	username: "User",
};
