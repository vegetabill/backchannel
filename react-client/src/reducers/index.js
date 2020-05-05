import Actions from "../actions";

export default function reduce(state, action) {
  console.debug(`handling action: ${action}`);
  switch (action.name) {
    case Actions.ACTION_RECEIVED:
      return {
        ...state,
        actions: [...state.actions, action.payload],
      };
    case Actions.CHANNEL_JOINED:
      return {
        ...state,
        channel: action.payload,
      };
    default:
      return state;
  }
}
