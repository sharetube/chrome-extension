import { colors } from "../../../../constants/colors";
import Button from "../shared/Button/Button";
import Input from "../shared/Input/Input";
import Title from "../shared/Title/Title";
import Avatar from "@entities/Avatar/Avatar";
import log from "@shared/lib/log";
import Back from "@shared/ui/Back/Back";
import React, { useEffect, useState } from "react";
import { user } from "types/user";

interface ProfileProps {
    user: user;
    changePage: () => void;
    updateProfile: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, changePage, updateProfile }) => {
    const [isUsernameChanged, setIsUsernameChanged] = useState<boolean>(false);
    const [isAvatarUrlChanged, setIsAvatarUrlChanged] = useState<boolean>(false);
    const [isColorChanged, setIsColorChanged] = useState<boolean>(false);
    const [isValidImage, setIsValidImage] = useState<boolean>(true);
    const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
    const [selectedColor, setSelectedColor] = useState<string>(user.color);
    const [username, setUsername] = useState<string>(user.username);
    const [avatarUrl, setAvatarUrl] = useState<string>(user.avatar_url);
    const [debouncedAvatarUrl, setDebouncedAvatarUrl] = useState<string>(user.avatar_url);
    const [isChanged, setIsChanged] = useState<boolean>(false);

    const validateImageUrl = (url: string): Promise<boolean> => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAvatarUrl(avatarUrl);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [avatarUrl]);

    useEffect(() => {
        const validate = async () => {
            if (debouncedAvatarUrl === user.avatar_url) {
                setIsValidImage(true);
                setIsAvatarUrlChanged(false);
                return;
            }
            const isValid = await validateImageUrl(debouncedAvatarUrl);
            setIsValidImage(isValid);
            setIsAvatarUrlChanged(isValid && debouncedAvatarUrl !== user.avatar_url);
        };

        if (debouncedAvatarUrl) {
            validate();
        }
    }, [debouncedAvatarUrl]);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;

        if (name === "username") {
            const isValid = value.length >= 1 && value.length <= 15;
            setIsValidUsername(isValid);
            setUsername(value);
            setIsUsernameChanged(isValid && value !== user.username);
        } else if (name === "avatar_url") {
            setAvatarUrl(value);
            setIsAvatarUrlChanged(value !== user.avatar_url);
        } else if (name === "color") {
            setSelectedColor(value);
            setIsColorChanged(value !== user.color);
        }
    };

    const setProfile = () => {
        const updatedUser: user = {
            username: username,
            avatar_url: avatarUrl,
            color: selectedColor,
        };

        chrome.runtime.sendMessage({ action: "updateProfile", data: updatedUser }, response => {
            if (response.success) {
                log("Profile successfully updated", response.data);
                updateProfile();
            } else {
                log("Error updating profile:", response.error);
            }
        });

        setIsColorChanged(false);
        setIsAvatarUrlChanged(false);
        setIsUsernameChanged(false);
    };

    useEffect(() => {
        setIsChanged(isUsernameChanged || isAvatarUrlChanged || isColorChanged);
    }, [isUsernameChanged, isAvatarUrlChanged, isColorChanged]);

    return (
        <React.Fragment>
            <header className="p-4 flex items-center border-t-0 border-r-0 border-l-0 border-b border-solid border-spec-outline">
                <div className="m-[0_8px_0_0] w-[24px] h-[24px]">
                    <button
                        className="w-[24px] h-[24px] text-text-primary border-none p-0 m-0 bg-transparent hover:cursor-pointer"
                        onClick={changePage}
                        title="Back"
                    >
                        <Back />
                    </button>
                </div>
                <h1 className="font-secondary text-text-primary text-[16px] leading-[22px] font-normal">
                    Profile
                </h1>
            </header>
            <section className="p-[16px]">
                <div className="m-[0_auto_12px] h-[112px] w-[112px]">
                    <Avatar
                        size="l"
                        url={avatarUrl}
                        letter={username.slice(0, 1)}
                        color={selectedColor}
                    />
                </div>
                <div className="m-[0_0_12px]">
                    <Title>Username</Title>
                    <Input
                        name="username"
                        value={username}
                        onChange={changeHandler}
                        minLength={1}
                        maxLength={15}
                        style={{ color: selectedColor }}
                    ></Input>
                </div>
                <div className="m-[0_0_12px]">
                    <Title>Color</Title>
                    <div className="grid grid-cols-8 grid-rows-2 gap-y-[6px]">
                        {colors.map(color => (
                            <label
                                key={color}
                                className="w-[30px] h-[30px] rounded-[8px] border-none p-0 m-0 bg-transparent hover:cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="color"
                                    value={color}
                                    checked={selectedColor === color}
                                    onChange={changeHandler}
                                    className="hidden"
                                />
                                <span
                                    className={`rounded-[8px] inline-block ${
                                        selectedColor === color
                                            ? "border-2 border-solid border-text-primary w-[26px] h-[26px]"
                                            : "w-[30px] h-[30px]"
                                    }`}
                                    style={{ backgroundColor: color }}
                                ></span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="m-[0_0_12px]">
                    <Title>Avatar url</Title>
                    <Input name="avatar_url" value={avatarUrl} onChange={changeHandler}></Input>
                </div>
                <Button disabled={!isChanged} onClick={setProfile}>
                    Save
                </Button>
            </section>
        </React.Fragment>
    );
};

export default Profile;
