import { AppAction, RemoteAction, ActionType } from "../actions";
import { ProtocolMessage, User, MessageCategory } from "backchannel-common";
import shortId from "shortid";

export interface AppState {
  members: Array<User>;
  messages: Array<ProtocolMessage>;
  user: User;
  outbox: Array<ProtocolMessage>;
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
        let outbox = state.outbox;
        let idx = state.outbox.findIndex((outMsg) => outMsg.id === message.id);
        if (idx >= 0) {
          outbox = outbox.slice(0, idx).concat(outbox.slice(idx + 1));
        }
        return {
          ...state,
          outbox,
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
        const remainingMembers = state.members.filter(
          (member) => member.id !== message.actor.id
        );
        return {
          ...state,
          messages,
          members: remainingMembers,
        };
      default:
        break;
    }
  } else if (isAppAction(action)) {
    const { type, payload } = action;
    switch (type) {
      case ActionType.SentChat:
        const protoMsg = {
          id: shortId.generate(),
          category: MessageCategory.SentChat,
          actor: state.user,
          payload,
          timestamp: new Date(),
        };
        activeChannel.send(protoMsg);
        return {
          ...state,
          outbox: state.outbox.concat(protoMsg),
        };
      default:
        break;
    }
  }
  return state;
}
