import hash from "object-hash";
import { timeS } from "../utils/date";
import { BaseSectionsVarbs, makeBaseSectionsVarbs } from "./baseSectionsVarbs";

describe(`sectionsVarbs`, () => {
  let sectionsVarbs: BaseSectionsVarbs;
  let sectionsVarbsHash: string;
  let sectionsVarbs2: BaseSectionsVarbs;
  let sectionsVarbs2Hash: string;

  beforeEach(async () => {
    sectionsVarbs = makeBaseSectionsVarbs();
    sectionsVarbsHash = hash(sectionsVarbs);
    await timeS.delay(1001);
    sectionsVarbs2 = makeBaseSectionsVarbs();
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
