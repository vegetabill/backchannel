import * as shortId from "shortid";
import { shuffle } from "lodash";
import { User } from "backchannel-common";

const seeds = require("./usernames.json");

function* nameGenerator(): Generator<string, string, string> {
  const names = [];
  const adjectives = [];

  while (true) {
    if (names.length === 0) {
      names.push(...shuffle(seeds.names));
    }
    if (adjectives.length === 0) {
      adjectives.push(...shuffle(seeds.adjectives));
    }
    yield [adjectives.pop(), names.pop()].join(" ");
  }
}

const generator = nameGenerator();

export function generateUser(): User {
  return {
    id: shortId.generate(),
    name: generator.next().value,
  };
}
