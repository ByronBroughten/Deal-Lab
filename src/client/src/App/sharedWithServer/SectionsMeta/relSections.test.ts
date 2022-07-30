import { isEqual } from "lodash";
import hash from "object-hash";
import { makeRelSections, RelSections } from "./relSections";

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

    beforeEach(() => {
      relSections = makeRelSections();
      relSectionsHash = hash(relSections);

      relSections2 = makeRelSections();
      relSections2Hash = hash(relSections2);
    });

    it("should produce a hash that is equal", () => {
      expect(relSectionsHash).toBe(relSections2Hash);
    });
    it("should produce a hash that is not equal", () => {
      relSections2.publicUserInfo.displayName = null as any;
      relSections2Hash = hash(relSections2);
      expect(relSectionsHash).not.toBe(relSections2Hash);
    });
  });
});
