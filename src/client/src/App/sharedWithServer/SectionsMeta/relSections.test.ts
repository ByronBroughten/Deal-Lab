import { isEqual } from "lodash";
import hash from "object-hash";
import { makeRelSections, RelSections } from "./relSections";

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

describe(`relSections`, () => {
  let relSections: any;

  beforeEach(async () => {
    relSections = makeRelSections();
  });

  it("should produce relSections that are functionally equal", () => {
    const relSections2 = makeRelSections();
    expect(isEqual(relSections, relSections2)).toBe(true);
  });

  describe(`relSectionsDidChange`, () => {
    let relSections: RelSections;
    let relSectionsHash: string;
    let relSections2: RelSections;
    let relSections2Hash: string;

    beforeEach(async () => {
      relSections = makeRelSections();
      relSectionsHash = hash(relSections);
      await delay(1001);
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
      relSections2.userInfo.displayName = null as any;
      relSections2Hash = hash(relSections2);
      expect(relSectionsHash).not.toBe(relSections2Hash);
    });
  });
});
