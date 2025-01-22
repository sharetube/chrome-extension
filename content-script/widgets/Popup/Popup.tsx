import { ContentScriptMessagingClient } from "@shared/client/client";
import ShareTubeIcon from "@shared/ui/ShareTubeIcon/ShareTubeIcon";
import { defaultProfile } from "constants/defaultProfile";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type ExtensionMessagePayloadMap,
	ExtensionMessageType,
} from "types/extensionMessage";
import type { ProfileType } from "types/profile.type";
import Profile from "./pages/Profile";
import Room from "./pages/Room";

const Popup: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isProfileEdit, setIsProfileEdit] = useState<boolean>(false);
	const [user, setUser] = useState<ProfileType>(defaultProfile);
	const ref = useRef<HTMLDivElement>(null);

	const contentScriptMessagingClient = new ContentScriptMessagingClient();

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			event.target instanceof Node &&
			ref.current?.parentElement?.contains(event.target)
		) {
			return;
		}

		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsExpanded(false);
		}
	}, []);

	const handleClick = useCallback(
		(event: React.MouseEvent | React.KeyboardEvent) => {
			event.stopPropagation();
			setIsExpanded((prev) => !prev);
		},
		[],
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	const changePage = () => setIsProfileEdit(!isProfileEdit);

	useEffect(() => {
		ContentScriptMessagingClient.sendMessage(
			ExtensionMessageType.GET_PROFILE,
		).then((payload: ProfileType) => {
			setUser(payload);
		});
	}, []);

	useEffect(() => {
		contentScriptMessagingClient.addHandler(
			ExtensionMessageType.PROFILE_UPDATED,
			(
				payload: ExtensionMessagePayloadMap[ExtensionMessageType.PROFILE_UPDATED],
			) => {
				setUser(payload);
			},
		);
	}, [contentScriptMessagingClient]);

	return (
		<div className="st-popup h-[40px] w-[40px] box-border relative m-[0_8px_0_0]">
			<div
				className="hover:bg-spec-button-chip-background-hover hover:cursor-pointer text-spec-wordmark-text h-[40px] w-[40px] box-border flex rounded-full"
				onClick={handleClick}
				onKeyDown={handleClick}
			>
				<div className="m-auto h-[24px] w-[24px]">
					<ShareTubeIcon />
				</div>
			</div>
			{isExpanded && (
				<div
					ref={ref}
					className="st-popup__content box-border w-[300px] rounded-[12px] bg-spec-menu-background absolute right-0 top-[40px] z-[2300] shadow-box-shadow"
				>
					{isProfileEdit ? (
						<Profile changePage={changePage} user={user} />
					) : (
						<Room changePage={changePage} profile={user} />
					)}
				</div>
			)}
		</div>
	);
};

export default Popup;
