import { Channel, User } from "backchannel-common";
import * as shortId from "shortid";
import * as WebSocket from "ws";

export function createChannel(name?: string): Channel {
  const thirtyMinutesFromNow = Date.now() + 1000 * 60 * 30;
  return {
    id: shortId.generate(),
    createdAt: new Date(),
    name,
    connections: new Map<User, WebSocket>(),
    expirationDate: new Date(thirtyMinutesFromNow),
  };
}
