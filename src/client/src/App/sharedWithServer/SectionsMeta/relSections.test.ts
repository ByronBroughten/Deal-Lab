import hash from "object-hash";
import { timeS } from "../utils/date";
import { makeRelSections, RelSections } from "./relSections";

describe(`relSections`, () => {
  let relSections: RelSections;
  let relSectionsHash: string;
  let relSections2: RelSections;
  let relSections2Hash: string;

  beforeEach(async () => {
    relSections = makeRelSections();
    relSectionsHash = hash(relSections);
    await timeS.delay(1001);
    relSections2 = makeRelSections();
    relSections2Hash = hash(relSections2);
  });
  it("should produce relSections that are equal", () => {
    expect(relSections).toEqual(relSections2);
  });
  it("should produce a hash that is equal", () => {
    expect(relSectionsHash).toBe(relSections2Hash);
  });
  it("should produce a hash that is not equal", () => {
    relSections2.userInfo.userName = null as any;
    relSections2Hash = hash(relSections2);
    expect(relSectionsHash).not.toBe(relSections2Hash);
  });
});
