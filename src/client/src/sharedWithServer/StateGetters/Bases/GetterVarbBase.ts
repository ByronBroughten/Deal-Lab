import { VarbMeta } from "../../StateMeta/VarbMeta";
import { SectionName } from "../../stateSchemas/SectionName";
import { isValidVarbNames } from "../Identifiers/VarbInfoBase";
import { GetterSectionBase, GetterSectionProps } from "./GetterSectionBase";

export class NotAVarbNameError extends Error {}

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
      throw new NotAVarbNameError(
        `"${varbName}" is not a varbName of "${sectionName}"`
      );
    }
  }
  get meta(): VarbMeta<SN> {
    return this.sectionMeta.varb(this.varbName);
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
