import { sectionTraits, GeneralSectionTraits, SectionTraits } from "./allSectionTraits/sectionTraits";
import {
    savableSectionVarbNames,
    SimpleSectionName,
    simpleSectionNames,
    UserPlan,
  } from "./baseSections";

type GeneralAllSectionTraits = {
    [SN in SimpleSectionName]: GeneralSectionTraits;
};

type DefaultSectionTraits = {
    [SN in SimpleSectionName]: SectionTraits
}

const defaultSectionTraits = simpleSectionNames.reduce((defaultSt, sectionName) => {
    defaultSt[sectionName] = sectionTraits();
    return defaultSt;
}, {} as DefaultSectionTraits)

const checkAllSectionTraits = <AST extends GeneralAllSectionTraits>(ast: AST): AST => ast;

const allSectionTraits = checkAllSectionTraits({
    ...defaultSectionTraits,
    outputList: sectionTraits({
        varbListItem: "outputItem",
        feFullIndexStoreName: "outputListMain",
        dbIndexStoreName: "outputListMain",
    })
});