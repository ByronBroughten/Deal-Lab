import { SxProps } from "@mui/material";
import { groupAdornment } from "../../../varbLabelUtils";
import { SectionGroupBaseNames } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseGroupNames";
import { groupVarbName } from "../../sharedWithServer/SectionsMeta/GroupName";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueFixedVarbPathName } from "../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { NumEditorType, NumObjEntityEditor } from "./NumObjEntityEditor";

type Props<LN extends SectionName = SectionName> = {
  feId: string;
  className?: string;
  labeled?: boolean;
  labelNames: SectionGroupBaseNames<"periodic", LN> | null;
  inputMargins?: boolean;
  editorType?: NumEditorType;
  quickViewVarbNames?: ValueFixedVarbPathName[];
  sx?: SxProps;
};

export function PeriodicEditor<LN extends SectionName = SectionName>({
  feId,
  labelNames,
  ...rest
}: Props<LN>) {
  const feInfo = { sectionName: "periodicEditor", feId } as const;
  const periodicEditor = useGetterSection(feInfo);
  const frequency = periodicEditor.valueNext("valueEditorFrequency");
  return (
    <NumObjEntityEditor
      {...{
        ...(labelNames
          ? {
              labelNames: {
                sectionName: labelNames.sectionName,
                varbName: groupVarbName(
                  labelNames.varbBaseName,
                  "periodic",
                  frequency
                ),
              },
            }
          : { labeled: false }),
        feVarbInfo: periodicEditor.varbInfo2("valueEditor"),
        endAdornment: groupAdornment("periodic", frequency),
        ...rest,
      }}
    />
  );
}
