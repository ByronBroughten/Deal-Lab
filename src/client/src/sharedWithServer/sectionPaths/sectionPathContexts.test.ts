import { checkSectionContextPaths } from "./sectionPathContexts";

describe("childPaths", () => {
  it("should have all valid paths", () => {
    expect(checkSectionContextPaths).not.toThrow();
  });
});
