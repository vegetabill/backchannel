import shortId from "shortid";
import { uniqBy } from "lodash";
import { AppAction, RemoteAction, ActionType } from "../model/Actions";
import { ProtocolMessage, User, MessageCategory } from "backchannel-common";

interface Channel {
  id: string;
  nickname: string;
  send(msg: ProtocolMessage): void;
}
export interface AppState {
  channel: Channel;
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

export const initialState = {
  channel: {
    id: "",
    nickname: "",
    send: (msg: ProtocolMessage) => {
      console.warn("Attempt to send message before connected", msg);
    },
  },
  messages: [],
  members: [],
  outbox: [],
  user: { name: "", id: "" },
};

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
        if (state.user && state.user.id === message.actor.id) {
          return state;
        }
        const members = uniqBy(state.members.concat(message.actor), "id");
        return {
          ...state,
          messages,
          members,
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
        state.channel.send(protoMsg);
        return {
          ...state,
          outbox: state.outbox.concat(protoMsg),
        };
      case ActionType.ChannelConnected:
        return {
          ...state,
          channel: action.payload as Channel,
        };
      default:
        break;
    }
  }
  return state;
}
