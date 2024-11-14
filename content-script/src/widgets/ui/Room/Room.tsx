import React from "react";

import Member from "@entities/ui/Member/Member";

interface RoomProps {
    className?: string;
}

const href =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.rbc.ru%2Fpolitics%2F27%2F07%2F2022%2F62e178769a7947680506a1be&psig=AOvVaw1LYEqxOS_95R4695_fhGM5&ust=1731690391362000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLC0jcen3IkDFQAAAAAdAAAAABAT";

const Room: React.FC<RoomProps> = props => {
    return (
        <div className={"st-room flex-growl" + props.className}>
            {/* <Member
                name="EvgenikaPonasenkova"
                avatar={href}
                color={"FF0000"}
                isAdmin={true}
            />
            <Member
                name="Vasy Vailenko"
                avatar={href}
                color={"F0AB23"}
                isAdmin={true}
            />
            <Member
                name="Artemka dota 2"
                avatar={href}
                color={"F000F3"}
                isAdmin={true}
            /> */}
        </div>
    );
};

export default Room;
