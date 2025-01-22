import type { ProfileType } from "../types/profile.type";
import { colors } from "./colors";

export const defaultProfile: ProfileType = {
	color: colors[0],
	avatar_url: "",
	username: "User",
};
