import { Room, User } from "./types";
import * as shortId from "shortid";
import * as WebSocket from "ws";

export function createRoom(nickname?: string): Room {
  const thirtyMinutesFromNow = Date.now() + 1000 * 60 * 30;
  return {
    id: shortId.generate(),
    createdAt: new Date(),
    nickname,
    members: new Map<User, WebSocket>(),
    expirationDate: new Date(thirtyMinutesFromNow),
  };
}
