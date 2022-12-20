import { checkAbsolutePathInfos } from "./sectionAbsolutePathInfos";

describe("childPaths", () => {
  it("should have all valid paths", () => {
    expect(checkAbsolutePathInfos).not.toThrow();
  });
});
