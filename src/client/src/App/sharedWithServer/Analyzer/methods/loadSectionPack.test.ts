import Analyzer from "../../Analyzer";
import { NumObj } from "../../SectionMetas/baseSections/baseValues/NumObj";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionPackRaw } from "../SectionPackRaw";
import StateSection from "../StateSection";

describe("Analyzer.addSectionAndSolve", () => {
  let next: Analyzer;
  let initSection: StateSection;
  let rawSectionPack: SectionPackRaw;
  let nextSection: StateSection;

  beforeEach(() => {
    next = Analyzer.initAnalyzer();
    initSection = next.lastSection("property") as StateSection;
  });

  function exec() {
    rawSectionPack = next.makeRawSectionPack(initSection.feInfo);
    next = next.loadRawSectionPack(rawSectionPack, {
      parentInfo: next.section("propertyGeneral").feInfo,
    });
    nextSection = next.lastSection("property") as StateSection;
  }

  describe("section changes", () => {
    let initSectionArr: StateSection[];
    beforeEach(() => {
      initSectionArr = next.sectionArr("property") as StateSection[];
      initSection = next.lastSection("property") as StateSection;
    });
    it("should make one more section", () => {
      exec();
      expect(next.sectionArr("property").length).toBe(
        initSectionArr.length + 1
      );
    });
    it("should make a section with the same dbId", () => {
      exec();
      expect(initSection.dbId === nextSection.dbId);
    });
  });
  describe("children changes", () => {
    let initChildArr: StateSection[];
    beforeEach(() => {
      next = next.addSectionAndSolve(
        "unit",
        initSection.feInfo as FeNameInfo<"property">
      );
      initSection = next.lastSection("property") as StateSection;
      initChildArr = next.sectionArr("unit") as StateSection[];
    });
    it("should add children equal to the number in the section from where the rawSectionPack came", () => {
      exec();
      expect(next.sectionArr("unit").length).toBe(
        initChildArr.length + initSection.childFeIds("unit").length
      );
    });
  });
  describe("valueChanges", () => {
    const priceNumber = 500000;
    const updateValues = {
      title: "Test Title",
      price: new NumObj({ editorText: `${priceNumber}`, entities: [] }),
    };
    let initInvestment: NumObj;

    beforeEach(() => {
      next = next.updateSectionValuesAndSolve(initSection.feInfo, updateValues);
      initSection = next.lastSection("property") as StateSection;
      initInvestment = next.section("final").value("totalInvestment", "numObj");
    });
    it("should add a section with the same values as the one from where the rawSectinPack came", () => {
      exec();
      expect(nextSection.value("title")).toBe(updateValues.title);
      expect(nextSection.value("price", "numObj").editorText).toBe(
        updateValues.price.editorText
      );
    });
    it("should solve", () => {
      exec();
      const finalInvestment = next
        .section("final")
        .value("totalInvestment", "numObj");
      expect(finalInvestment.number).toBe(
        (initInvestment.number as number) + priceNumber
      );
    });
  });
});
