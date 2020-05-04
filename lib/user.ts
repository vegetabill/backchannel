import shortId from "shortid";
import * as Chance from "chance";
import { User } from "./types";

const chance = new Chance();

export function generateUser(): User {
  return {
    id: shortId.generate(),
    name: chance.first(),
  };
}
