import { nanoid } from "nanoid";
import { nanoIdLength } from "./utils/validatorConstraints";

export function makeSectionId() {
  return nanoid(nanoIdLength);
}
