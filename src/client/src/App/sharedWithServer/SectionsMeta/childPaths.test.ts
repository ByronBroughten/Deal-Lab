import { checkChildPaths } from "./childPaths";

describe("childPaths", () => {
  it("should have all valid paths", () => {
    expect(checkChildPaths).not.toThrow();
  });
});
