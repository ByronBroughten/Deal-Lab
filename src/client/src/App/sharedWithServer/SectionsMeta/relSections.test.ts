import { isEqual } from "lodash";
import { makeRelSections } from "./relSections";

describe(`relSections`, () => {
  let relSections: any;

  beforeEach(async () => {
    relSections = makeRelSections();
  });

  it("should produce relSections that are functionally equal", () => {
    const relSections2 = makeRelSections();
    expect(isEqual(relSections, relSections2)).toBe(true);
  });
});
