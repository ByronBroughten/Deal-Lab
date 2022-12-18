import { checkChildPaths } from "./absoluteVarbPaths";

describe("childPaths", () => {
  it("should have all valid paths", () => {
    expect(checkChildPaths).not.toThrow();
  });
});
