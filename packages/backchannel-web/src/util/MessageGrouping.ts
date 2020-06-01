import { ProtocolMessage, MessageCategory } from "backchannel-common";

export enum GroupedCategory {
  MultiJoined,
  MultiLeft,
  MultiChatSent,
  Unknown,
}

export interface GroupedMessage {
  id: string;
  category: GroupedCategory;
  messages: Array<ProtocolMessage>;
}

export function isGroupedMessage(
  msg: ProtocolMessage | GroupedMessage
): msg is GroupedMessage {
  return (msg as GroupedMessage).messages !== undefined;
}

export function isUngroupedMessage(
  msg: ProtocolMessage | GroupedMessage
): msg is ProtocolMessage {
  return (msg as ProtocolMessage).category !== undefined;
}

export function groupMessages(
  messages: Array<ProtocolMessage>
): Array<ProtocolMessage | GroupedMessage> {
  function isGroupable(m1: ProtocolMessage, m2: ProtocolMessage): boolean {
    if (
      m1.category === MessageCategory.JoinedChannel &&
      m2.category === MessageCategory.JoinedChannel
    ) {
      return true;
    }

    if (
      m1.category === MessageCategory.LeftChannel &&
      m2.category === MessageCategory.LeftChannel
    ) {
      return true;
    }

    if (
      m1.category === MessageCategory.SentChat &&
      m2.category === MessageCategory.SentChat &&
      m1.actor.id === m2.actor.id
    ) {
      return true;
    }

    return false;
  }

  function groupCategory(msg: ProtocolMessage): GroupedCategory {
    switch (msg.category) {
      case MessageCategory.JoinedChannel:
        return GroupedCategory.MultiJoined;
      case MessageCategory.LeftChannel:
        return GroupedCategory.MultiLeft;
      case MessageCategory.SentChat:
        return GroupedCategory.MultiChatSent;
    }
    return GroupedCategory.Unknown;
  }

  const grouped: Array<Array<ProtocolMessage>> = [];
  messages.forEach((msg) => {
    const last = grouped[grouped.length - 1];
    if (last && last.length >= 1 && isGroupable(last[last.length - 1], msg)) {
      last.push(msg);
    } else {
      grouped.push([msg]);
    }
  });

  return grouped.map((oneOrMore) => {
    const first = oneOrMore[0];

    if (oneOrMore.length === 1) {
      return first;
    }

    return {
      id: oneOrMore.map((msg) => msg.id).join(""),
      messages: oneOrMore,
      category: groupCategory(first),
    };
  });
}
