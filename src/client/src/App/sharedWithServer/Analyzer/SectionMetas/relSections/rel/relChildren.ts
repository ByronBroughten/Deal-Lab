export type TestSectionChildren = {
  property: {
    initCount: 1;
    countIsMutable: false;
  };
  propertyIndex: {
    initCount: 0;
    countIsMutable: true;
  };
};
type TestMutable<CHN extends keyof TestSectionChildren> =
  TestSectionChildren[CHN]["countIsMutable"] extends true ? true : false;
type TestOneInit<CHN extends keyof TestSectionChildren> =
  TestSectionChildren[CHN]["initCount"] extends 1 ? true : false;

type AlwaysOne = {
  [CHN in keyof TestSectionChildren]: TestOneInit<CHN> extends true
    ? TestMutable<CHN> extends false
      ? // : Test OneParent<CHN> ? ...
        true
      : false
    : false;
};

// true
type Test = AlwaysOne["property"];

// next defaultSections (defined at the sectionMeta level)
type DefaultSections = {
  propertyGeneral: {
    property: { thisIsASectionPack: true };
  };
  financing: {
    loan: { thisIsASectionPack: true };
  };
  // ...
};
// I can run a test to check that the defaultSections
// abide by each parents' rules, too.
