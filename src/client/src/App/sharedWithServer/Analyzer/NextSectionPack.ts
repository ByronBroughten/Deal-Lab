import { SectionName } from "./SectionMetas/SectionName";
// import { ContextName } from "./SectionMetas/relSections/baseSections";
// import {
//   NextChildIdArrs,
//   SelfOrDescendantName,
// } from "./SectionMetas/relNameArrs/ChildTypes";
// import { RawSectionFinder } from "./SectinPacks/RawSectionFinder";

// type SelfOrDescendantChildDbIds<
//   SN extends SectionName,
//   CN extends ContextName
// > = NextChildIdArrs<CN, SelfOrDescendantName<SN, CN>>;

// export type RawSectionPack<
//   SN extends SectionName,
//   CN extends ContextName
// > = RawSectionFinder<SN, CN> & {
//   rawSections: RawSections<SN, CN>;
// } & SectionContextProps<SN, CN>;

// export type DbSectionPack<
//   SN extends SectionName,
//   CN extends ContextName
// > = Omit<RawSectionPack<SN, CN>, keyof SectionContextProps<SN, CN>>;

// function _testRawSectionPack(
//   feRaw: RawSectionPack<"propertyIndex", "fe">,
//   dbRaw: RawSectionPack<"propertyIndex", "db">
// ) {
//   const _test1 = feRaw.rawSections.cell;
//   // @ts-expect-error
//   const _test2 = feRaw.rawSections.unit;
//   const _test3 = dbRaw.rawSections.unit;
// }
