import { AppAction, RemoteAction } from "../actions";
import { ProtocolMessage, User, MessageCategory } from "backchannel-common";
import { without } from "lodash";

export interface AppState {
  members: Array<User>;
  messages: Array<ProtocolMessage>;
}

function isRemoteAction(
  action: AppAction | RemoteAction
): action is RemoteAction {
  return (action as RemoteAction).category !== undefined;
}

export default function reduce(
  state: AppState,
  action: AppAction | RemoteAction
): AppState {
  console.debug(`handling action`, action);
  if (isRemoteAction(action)) {
    const { category, message } = action;
    const messages = [...state.messages, message];
    switch (category) {
      case MessageCategory.JoinedChannel:
        return {
          ...state,
          messages,
          members: state.members.concat(message.actor),
        };
      case MessageCategory.LeftChannel:
        return {
          ...state,
          messages,
          members: without(state.members, message.actor),
        };
      default:
        return state;
    }
  }
  return state;
}
