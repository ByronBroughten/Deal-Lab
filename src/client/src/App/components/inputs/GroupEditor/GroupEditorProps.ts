import { SxProps } from "@mui/material";
import { FeVI } from "../../../../sharedWithServer/SectionInfo/FeInfo";
import { ValueFixedVarbPathName } from "../../../../sharedWithServer/SectionInfo/ValueInEntityInfo";
import {
  GroupKey,
  GroupName,
  groupVarbName,
} from "../../../../sharedWithServer/sectionVarbsConfig/GroupName";
import { SectionName } from "../../../../sharedWithServer/sectionVarbsConfig/SectionName";
import { GroupBaseVI } from "../../../../sharedWithServer/sectionVarbsConfigDerived/baseSectionsDerived/baseGroupNames";
import { StrictOmit } from "../../../../sharedWithServer/utils/types";
import { LabelProps, NumEditorType } from "../NumObjEntityEditor";

export type GroupEditorProps<
  GN extends GroupName,
  LN extends SectionName = SectionName
> = {
  feId: string;
  className?: string;
  labelInfo: FeVI<LN> | GroupBaseVI<GN, LN> | null;
  labelProps?: BaseProps<LN>;
  inputMargins?: boolean;
  editorType?: NumEditorType;
  quickViewVarbNames?: readonly ValueFixedVarbPathName[];
  sx?: SxProps;
};

type BaseProps<LN extends SectionName> = StrictOmit<
  LabelProps<LN>,
  "labelInfo"
>;

export function getLabelInfo<GN extends GroupName, LN extends SectionName>(
  groupName: GN,
  groupKey: GroupKey<GN>,
  labelInfo: FeVI<LN> | GroupBaseVI<GN, LN> | null
): FeVI<LN> | undefined {
  if (!labelInfo) {
    return undefined;
  } else if ("varbName" in labelInfo) {
    return labelInfo;
  } else {
    return {
      sectionName: labelInfo.sectionName,
      feId: labelInfo.feId,
      varbName: groupVarbName(labelInfo.varbBaseName, groupName, groupKey),
    } as any as FeVI<LN>;
  }
}
