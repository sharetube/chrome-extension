import Back from "@shared/ui/Back/Back";
import Settings from "@shared/ui/Settings/Settings";
import React, { useEffect, useState } from "react";

const Popup: React.FC = () => {
    const [isExpended, setIsExpended] = useState<boolean>(false);

    const expandChange = () => {
        setIsExpended(!isExpended);
    };

    const handleClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("st-popup__content"))
            return;
        setIsExpended(false);
    };

    useEffect(() => {
        if (isExpended) {
            document.addEventListener("click", handleClick);
        } else {
            document.removeEventListener("click", handleClick);
            setEdit(false);
        }

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isExpended]);

    const [edit, setEdit] = useState<boolean>(false);
    const [unsave, setUnsave] = useState<boolean>(false);

    const handleEdit = () => {
        unsave ? "" : setEdit(!edit);
    };

    const [nickname, setNickname] = useState<string>("Евгений Zsvo");
    const [color, setColor] = useState<string>("CDDC39");
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    return (
        <div className="st-popup h-[40px] w-[40px] box-border relative m-[0_8px_0_0]">
            <div
                className="hover:bg-spec-button-chip-background-hover hover:cursor-pointer text-spec-wordmark-text h-[40px] w-[40px] box-border flex rounded-full"
                onClick={expandChange}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[24px] w-[24px] fill-current m-auto"
                >
                    <path d="M7.54718 14.1135H8.14718V13.5135H7.54718V14.1135ZM10.9674 16.0909L11.4872 15.7913L11.1874 15.2712L10.6675 15.5712L10.9674 16.0909ZM7.54718 18.0649H6.94718V19.1039L7.8471 18.5845L7.54718 18.0649ZM4.20254 18.0567C4.20254 16.2105 5.69978 14.7135 7.54718 14.7135V13.5135C5.03745 13.5135 3.00254 15.5474 3.00254 18.0567H4.20254ZM7.54718 21.4C5.69978 21.4 4.20254 19.9029 4.20254 18.0567H3.00254C3.00254 20.5661 5.03745 22.6 7.54718 22.6V21.4ZM10.8918 18.0567C10.8918 19.9029 9.39457 21.4 7.54718 21.4V22.6C10.0569 22.6 12.0918 20.5661 12.0918 18.0567H10.8918ZM10.4476 16.3905C10.7301 16.8806 10.8918 17.4489 10.8918 18.0567H12.0918C12.0918 17.2329 11.8719 16.4586 11.4872 15.7913L10.4476 16.3905ZM10.6675 15.5712L7.24726 17.5452L7.8471 18.5845L11.2673 16.6106L10.6675 15.5712ZM8.14718 18.0649V14.1135H6.94718V18.0649H8.14718Z" />
                    <path d="M10.9674 7.90906L10.6675 8.42872L11.1874 8.7288L11.4872 8.2087L10.9674 7.90906ZM7.54718 9.88644V10.4864H8.14718V9.88644H7.54718ZM7.54718 5.93509L7.8471 5.41543L6.94718 4.89605V5.93509H7.54718ZM10.8918 5.94322C10.8918 6.5511 10.7301 7.11941 10.4476 7.60942L11.4872 8.2087C11.8719 7.54133 12.0918 6.76704 12.0918 5.94322H10.8918ZM7.54718 2.6C9.39457 2.6 10.8918 4.09701 10.8918 5.94322H12.0918C12.0918 3.43386 10.0569 1.4 7.54718 1.4V2.6ZM4.20254 5.94322C4.20254 4.09701 5.69978 2.6 7.54718 2.6V1.4C5.03745 1.4 3.00254 3.43386 3.00254 5.94322H4.20254ZM7.54718 9.28644C5.69978 9.28644 4.20254 7.78942 4.20254 5.94322H3.00254C3.00254 8.45257 5.03745 10.4864 7.54718 10.4864V9.28644ZM8.14718 9.88644V5.93509H6.94718V9.88644H8.14718ZM7.24726 6.45475L10.6675 8.42872L11.2673 7.3894L7.8471 5.41543L7.24726 6.45475Z" />
                    <path d="M18.0554 12.0001L18.3553 12.5198L19.2557 12.0001L18.3553 11.4804L18.0554 12.0001ZM14.6387 13.972L14.3388 13.4524L13.8184 13.7527L14.1194 14.2726L14.6387 13.972ZM14.6387 10.0282L14.1194 9.7276L13.8184 10.2475L14.3388 10.5478L14.6387 10.0282ZM17.7555 11.4804L14.3388 13.4524L14.9386 14.4917L18.3553 12.5198L17.7555 11.4804ZM14.3388 10.5478L17.7555 12.5198L18.3553 11.4804L14.9386 9.50851L14.3388 10.5478ZM15.158 10.3287C15.7372 9.32805 16.8182 8.65688 18.0554 8.65688V7.45688C16.3727 7.45688 14.9044 8.37138 14.1194 9.7276L15.158 10.3287ZM18.0554 8.65688C19.9028 8.65688 21.4 10.1539 21.4 12.0001H22.6C22.6 9.49075 20.5651 7.45688 18.0554 7.45688V8.65688ZM21.4 12.0001C21.4 13.8463 19.9028 15.3433 18.0554 15.3433V16.5433C20.5651 16.5433 22.6 14.5095 22.6 12.0001H21.4ZM18.0554 15.3433C16.8182 15.3433 15.7372 14.6722 15.158 13.6715L14.1194 14.2726C14.9044 15.6288 16.3727 16.5433 18.0554 16.5433V15.3433Z" />
                </svg>
            </div>
            {isExpended && (
                <div
                    className="st-popup__content box-border w-[345px] h-[300px] rounded-[12px] bg-spec-menu-background absolute right-0 top-[40px] z-[2300]"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    <header className="flex items-center justify-between w-[100%] p-[0_8px_0_16px] h-[49px] box-border border-b border-solid border-spec-outline border-t-0 border-r-0 border-l-0">
                        <p className="text-text-primary font-secondary text-[1.6rem] leading-[2.2rem] font-normal m-0 p-0 select-none">
                            ShareTube profile
                        </p>
                        <div
                            className="w-[40px] h-[40px] text-text-primary flex hover:bg-spec-button-chip-background-hover hover:cursor-pointer rounded-full m-0 p-0"
                            onClick={() => {
                                handleEdit();
                            }}
                        >
                            <div className="w-[24px] h-[24px] m-auto">
                                {edit && <Back />}
                                {!edit && <Settings />}
                            </div>
                        </div>
                    </header>
                    {!edit && (
                        <div className="p-[16px_8px] flex items-center flex-col">
                            <div
                                className="rounded-full h-[92px] w-[92px] flex items-center justify-center bg-center bg-no-repeat bg-cover"
                                style={{
                                    backgroundImage: `url(${avatarUrl})`,
                                    backgroundColor: avatarUrl
                                        ? "transparent"
                                        : `#${color}`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {!avatarUrl && (
                                    <p className="font-secondary text-white m-0 p-0 text-center text-[3.2rem] select-none">
                                        {nickname.slice(0, 1)}
                                    </p>
                                )}
                            </div>
                            <h1 className="text-text-primary font-primary p-0 m-[8px_0_0] text-[2rem] leading-[2.8rem] font-bold text-center select-none">
                                {nickname}
                            </h1>
                        </div>
                    )}
                    {edit && (
                        <div className="p-[16px_8px] flex items-center flex-col">
                            gg
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Popup;
