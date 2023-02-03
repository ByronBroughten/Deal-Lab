import { PathVarbNames } from "../../SectionsMeta/SectionInfo/PathNameInfo";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import {
  PathSectionName,
  SectionPathName,
} from "../../SectionsMeta/sectionPathContexts/sectionPathNames";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { SetterVarb } from "../SetterVarb";
import { SetterTesterVarbBase } from "./Bases/SetterTesterVarbBase";
import { SetterTesterSection } from "./SetterTesterSection";

export class SetterTesterVarb<
  SN extends SectionNameByType
> extends SetterTesterVarbBase<SN> {
  static init<PN extends SectionPathName>({
    pathName,
    varbName,
  }: PathVarbNames<PN>): SetterTesterVarb<PathSectionName<PN>> {
    const section = SetterTesterSection.initByPathName(pathName);
    return new SetterTesterVarb({
      ...section.testerProps,
      varbName: varbName as string,
    });
  }

  get setter(): SetterVarb<SN> {
    return new SetterVarb(this.setterVarbTestProps);
  }
  get get(): GetterVarb<SN> {
    return new GetterVarb(this.setterVarbTestProps);
  }
}
