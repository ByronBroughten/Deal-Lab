import hash from "object-hash";
import { timeS } from "../utils/timeS";
import {
  AllBaseSectionVarbs,
  makeAllBaseSectionVarbs,
} from "./allBaseSectionVarbs";

describe(`allBaseSectionVarbs`, () => {
  let sectionsVarbs: AllBaseSectionVarbs;
  let sectionsVarbsHash: string;
  let sectionsVarbs2: AllBaseSectionVarbs;
  let sectionsVarbs2Hash: string;

  beforeEach(async () => {
    sectionsVarbs = makeAllBaseSectionVarbs();
    sectionsVarbsHash = hash(sectionsVarbs);
    await timeS.delay(50);
    sectionsVarbs2 = makeAllBaseSectionVarbs();
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
