import crypto from "crypto";

export function toSentence(items: Array<Object>): string {
  if (items.length === 0) {
    return "";
  }
  if (items.length === 1) {
    return items[0].toString();
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} and ${items.slice(-1)}`;
}

export function sentenceWithVerb(
  items: Array<Object>,
  singular: string,
  plural: string
): string {
  if (items.length === 0) {
    return "";
  }
  if (items.length >= 2) {
    return toSentence(items) + " " + plural;
  }
  return toSentence(items) + " " + singular;
}

export function md5(s: string): string {
  return crypto.createHash("md5").update(s).digest("base64").substr(0, 8);
}
