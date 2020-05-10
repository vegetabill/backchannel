import { AppAction, RemoteAction, ActionType } from "../actions";
import { ProtocolMessage, User, MessageCategory } from "backchannel-common";
import { without } from "lodash";
import shortId from "shortid";

export interface AppState {
  members: Array<User>;
  messages: Array<ProtocolMessage>;
  user: User;
}

function isRemoteAction(
  action: AppAction | RemoteAction
): action is RemoteAction {
  return (action as RemoteAction).category !== undefined;
}

function isAppAction(action: AppAction | RemoteAction): action is AppAction {
  return (action as AppAction).type !== undefined;
}

let activeChannel = {
  send(msg: ProtocolMessage) {
    console.warn("Tried to send message before connected", msg);
  },
};

export function registerChannel(channel: any) {
  activeChannel = channel;
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
      case MessageCategory.SentChat:
        return {
          ...state,
          messages,
        };
      case MessageCategory.IdentityGranted:
        return {
          ...state,
          user: message.actor,
        };
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
        break;
    }
  } else if (isAppAction(action)) {
    const { type, payload } = action;
    switch (type) {
      case ActionType.SentChat:
        activeChannel.send({
          id: shortId.generate(),
          category: MessageCategory.SentChat,
          actor: state.user,
          payload,
          timestamp: new Date(),
        });
      default:
        break;
    }
  }
  return state;
}
