import Profile from './pages/Profile';
import Room from './pages/Room';
import ShareTube from '@shared/ui/ShareTube/ShareTube';
import React, {useEffect, useState} from 'react';
import {defaultUser} from 'types/defaultUser';
import {user} from 'types/user';

const Popup: React.FC = () => {
    const [isExpended, setIsExpended] = useState<boolean>(false);

    const expandChange = () => {
        setIsExpended(!isExpended);
    };

    const handleClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('st-popup__content')) return;
        setIsExpended(false);
    };

    useEffect(() => {
        if (isExpended) {
            document.addEventListener('click', handleClick);
        } else {
            document.removeEventListener('click', handleClick);
            setIsProfileEdit(false);
        }

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [isExpended]);

    const [isProfileEdit, setIsProfileEdit] = useState<boolean>(false);

    const changePage = () => setIsProfileEdit(!isProfileEdit);

    const [user, setUser] = useState<user | defaultUser>({
        avatar_url: '',
        color: '',
        username: 'User',
    });

    const getProfile = () => {
        chrome.runtime.sendMessage({action: 'getProfile'}, response => {
            if (response && response.success) {
                setUser(response.data);
            } else {
                console.error('Error getting profile:', response.error);
            }
        });
    };

    useEffect(() => {
        getProfile();
    }, [isExpended]);

    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.action === 'profileSet') {
                getProfile();
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    const updateProfile = getProfile;

    return (
        <div className="st-popup h-[40px] w-[40px] box-border relative m-[0_8px_0_0]">
            <div
                className="hover:bg-spec-button-chip-background-hover hover:cursor-pointer text-spec-wordmark-text h-[40px] w-[40px] box-border flex rounded-full"
                onClick={expandChange}
            >
                <div className="m-auto h-[24px] w-[24px]">
                    <ShareTube />
                </div>
            </div>
            {isExpended && (
                <div
                    className="st-popup__content box-border w-[300px] rounded-[12px] bg-spec-menu-background absolute right-0 top-[40px] z-[2300]"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    {isProfileEdit && (
                        <Profile
                            changePage={changePage}
                            updateProfile={updateProfile}
                            user={user}
                        />
                    )}
                    {!isProfileEdit && <Room changePage={changePage} user={user} />}
                </div>
            )}
        </div>
    );
};

export default Popup;
