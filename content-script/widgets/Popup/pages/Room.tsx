import {user} from '../../../../types/user';
import Button from '../shared/Button/Button';
import Input from '../shared/Input/Input';
import Title from '../shared/Title/Title';
import Avatar from '@entities/Avatar/Avatar';
import validate from '@shared/api/validateVideo';
import Next from '@shared/ui/Next/Next';
import React, {useEffect, useState} from 'react';

interface RoomProps {
    changePage: () => void;
    user: user;
}

const Room: React.FC<RoomProps> = ({user, changePage}) => {
    const [isRoom, setIsRoom] = useState<boolean>(true);

    useEffect(() => {
        chrome.runtime.sendMessage({action: 'checkPrimaryTabExists'}, response => {
            if (response.exists) {
                setIsRoom(true);
                setIsNavigateButtonDisabled(false);
            } else {
                setIsRoom(false);
                setIsNavigateButtonDisabled(true);
            }
        });
        const messageListener = (message: any) => {
            if (message.action === 'primaryTabSet') {
                setIsRoom(true);
                setIsNavigateButtonDisabled(false);
            } else if (message.action === 'primaryTabUnset') {
                setIsRoom(false);
                setIsNavigateButtonDisabled(true);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isNavigateButtonDisabled, setIsNavigateButtonDisabled] = useState(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.length >= 16) {
            validate(value).then(isValid => {
                setIsButtonDisabled(!isValid);
            });
        }
    };

    const handleButtonClick = () => {
        const urlPattern =
            /^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
        const match = inputValue.match(urlPattern);
        if (match && match[2]) {
            setInputValue('');
            const videoId = match[2];
            chrome.runtime.sendMessage({action: 'createNewTab', videoId});
        }
    };

    const moveToTab = () => {
        chrome.runtime.sendMessage({action: 'moveToPrimaryTab'});
    };

    const [isPrimaryTab, setIsPrimaryTab] = useState(true);
    useEffect(() => {
        chrome.runtime.sendMessage({action: 'isPrimaryTab'}, responce => {
            if (responce.isPrimary) {
                setIsPrimaryTab(true);
            } else {
                setIsPrimaryTab(false);
            }
        });
    }, [isPrimaryTab]);

    return (
        <React.Fragment>
            <header className="p-4 border-t-0 border-r-0 border-l-0 border-b border-solid border-spec-outline">
                <h1 className="font-secondary text-text-primary text-[16px] leading-[22px] font-normal select-none">
                    ShareTube
                </h1>
            </header>
            <section
                className={`p-[16px_25px_16px_16px] flex items-center justify-between ${isPrimaryTab ? '' : 'border-t-0 border-r-0 border-l-0 border-b border-solid border-spec-outline'}  hover:cursor-pointer`}
                onClick={changePage}
                title="ShareTube profile"
            >
                <div className="flex items-center gap-4 select-none">
                    <Avatar
                        size="m"
                        url={user.avatar_url}
                        letter={user.username.slice(0, 1)}
                        color={user.color}
                    />
                    <h2
                        className="text-[16px] leading-[22px] font-normal font-secondary"
                        style={{color: user.color}}
                    >
                        {user.username}
                    </h2>
                </div>
                <div>
                    <Next />
                </div>
            </section>
            {isRoom && !isPrimaryTab && (
                <section className="flex items-center justify-center p-[16px]">
                    <Button disabled={isNavigateButtonDisabled} onClick={moveToTab}>
                        Navigate to player tab
                    </Button>
                </section>
            )}
            {!isRoom && (
                <section className="p-[16px]">
                    <Title>Initial video</Title>
                    <Input value={inputValue} onChange={handleInputChange} />
                    <div className="m-[32px_0_0]">
                        <Button onClick={handleButtonClick} disabled={isButtonDisabled}>
                            Create room
                        </Button>
                    </div>
                </section>
            )}
        </React.Fragment>
    );
};

export default Room;
