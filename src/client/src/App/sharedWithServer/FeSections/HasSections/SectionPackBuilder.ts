import { applyMixins } from "../../../utils/classObjects";
import { SectionAdder } from "./SectionAdder";
import { SectionPackLoader } from "./SectionPackLoader";
import { SectionPackMaker } from "./SectionPackMaker";
import { HasSharableSections } from "./Sections";

export interface SectionPackBuilder
  extends HasSharableSections,
    SectionAdder,
    SectionPackMaker {}
export class SectionPackBuilder extends HasSharableSections {}

applyMixins(SectionPackLoader, [SectionAdder, SectionPackMaker]);

// How do I initit?

const builder = new SectionPackBuilder();

builder.addSection({
  sectionName: "analysis",
  parentFinder: builder.sections.mainFeInfo,
});

const { feInfo: analyzerInfo } = builder.sections.list("analysis").last;

builder.addSection({
  sectionName: "propertyGeneral",
  parentFinder: analyzerInfo,
});

const { feInfo: pgInfo } = builder.sections.list("propertyGeneral").last;

builder.addSection({
  sectionName: "property",
  parentFinder: pgInfo,
  dbVarbs: {},
});

// const property = main.addDescendantAndGet(["propertyGeneral", "property"], { dbValues: { ... } })
// property.addChild("upfrontCostList", { dbValues: { ... } });
// property.addChild("upfrontCostList", { dbValues: { ... } });
// property.addChild("ongoingCostList", { dbValues: { ... } });

const { feInfo: propertyInfo } = builder.sections.list("property").last;
const defaultProperty = builder.makeSectionPack(propertyInfo);
