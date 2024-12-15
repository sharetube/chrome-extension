import { user } from "./user";

export enum ExtensionMessageType {
    PRIMARY_TAB_SET = "PRIMARY_TAB_SET",
    PRIMARY_TAB_UNSET = "PRIMARY_TAB_UNSET",
    PROFILE_UPDATED = "PROFILE_UPDATED",
    GET_PROFILE = "GET_PROFILE",
    UPDATE_PROFILE = "UPDATE_PROFILE",
    CREATE_ROOM = "CREATE_ROOM",
    SWITCH_TO_PRIMARY_TAB = "SWITCH_TO_PRIMARY_TAB",
    CHECK_PRIMARY_TAB_EXISTS = "CHECK_PRIMARY_TAB_EXISTS",
    IS_PRIMARY_TAB = "IS_PRIMARY_TAB",
}

export interface CrateRoomPayload {
    videoId: string;
}

export type ExtensionMessagePayloadMap = {
    [ExtensionMessageType.PRIMARY_TAB_SET]: null;
    [ExtensionMessageType.PRIMARY_TAB_UNSET]: null;
    [ExtensionMessageType.PROFILE_UPDATED]: user;
    [ExtensionMessageType.GET_PROFILE]: null;
    [ExtensionMessageType.UPDATE_PROFILE]: user;
    [ExtensionMessageType.SWITCH_TO_PRIMARY_TAB]: null;
    [ExtensionMessageType.CHECK_PRIMARY_TAB_EXISTS]: null;
    [ExtensionMessageType.IS_PRIMARY_TAB]: null;
    [ExtensionMessageType.CREATE_ROOM]: CrateRoomPayload;
};

export interface ExtensionMessage<T extends ExtensionMessageType> {
    type: ExtensionMessageType;
    payload: ExtensionMessagePayloadMap[T];
}
