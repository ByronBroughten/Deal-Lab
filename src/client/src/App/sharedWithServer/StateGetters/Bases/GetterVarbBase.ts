import { isValidVarbNames } from "../../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterSectionBase, GetterSectionProps } from "./GetterSectionBase";

export interface GetterVarbProps<SN extends SectionName>
  extends GetterSectionProps<SN> {
  varbName: string;
}
export class GetterVarbBase<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  readonly varbName: string;
  constructor({ varbName, ...props }: GetterVarbProps<SN>) {
    super(props);
    this.varbName = varbName;
    const { sectionName } = props;
    if (!isValidVarbNames({ sectionName, varbName })) {
      throw new Error(`"${varbName}" is not a varbName of "${sectionName}"`);
    }
  }
  get feVarbInfo() {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
  get getterVarbProps(): GetterVarbProps<SN> {
    return {
      ...this.feVarbInfo,
      ...this.getterSectionsProps,
    };
  }
}
