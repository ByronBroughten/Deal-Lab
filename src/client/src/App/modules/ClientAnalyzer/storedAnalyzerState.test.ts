import { makeRelSections } from "../../sharedWithServer/Analyzer/SectionMetas/relSections";
import hash from "object-hash";

describe(`relSectionsDidChange`, () => {
  let relSections: any;
  let relSectionsHash: any;

  beforeEach(async () => {
    relSections = makeRelSections();
    relSectionsHash = hash(relSections);
  });

  it("should produce a hash that is equal", () => {
    const relSections2 = makeRelSections();
    const relSections2Hash = hash(relSections2);
    expect(relSectionsHash).toBe(relSections2Hash);
  });
  it("should produce a hash that is not equal", () => {
    const relSections2 = makeRelSections() as any;
    relSections2.user.childSectionNames.push("sectionName");
    const relSections2Hash = hash(relSections2);
    expect(relSectionsHash).not.toBe(relSections2Hash);
  });
});
