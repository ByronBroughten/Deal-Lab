import Analyzer from "../../Analyzer";

describe(`addSection`, () => {
  let analyzer: Analyzer;

  // I want to make a new analyzer, and it can be empty.

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
  });

  it("should not have a section", () => {
    expect(analyzer.sectionArr("property").length).toBe(0);
  });

  it("should have a section", () => {
    analyzer.addSectionAndSolve("property", "propertyGeneral");

    expect(analyzer).toBe(null);
  });
});
