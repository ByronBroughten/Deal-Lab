import hash from "object-hash";
import { timeS } from "../utils/timeS";
import {
  makeSectionStructures,
  Schema2SectionStructures,
} from "./schema3SectionStructures";

describe(`schema2SectionStructures`, () => {
  let sectionsVarbs: Schema2SectionStructures;
  let sectionsVarbsHash: string;
  let sectionsVarbs2: Schema2SectionStructures;
  let sectionsVarbs2Hash: string;

  beforeEach(async () => {
    sectionsVarbs = makeSectionStructures();
    sectionsVarbsHash = hash(sectionsVarbs);
    await timeS.delay(50);
    sectionsVarbs2 = makeSectionStructures();
    sectionsVarbs2Hash = hash(sectionsVarbs2);
  });
  it("should produce sectionsVarbs that are equal", () => {
    expect(sectionsVarbs).toEqual(sectionsVarbs2);
  });
  it("should produce a hash that is equal", () => {
    expect(sectionsVarbsHash).toBe(sectionsVarbs2Hash);
  });
  it("should produce a hash that is not equal", () => {
    sectionsVarbs2.userInfo.userName = null as any;
    sectionsVarbs2Hash = hash(sectionsVarbs2);
    expect(sectionsVarbsHash).not.toBe(sectionsVarbs2Hash);
  });
});
