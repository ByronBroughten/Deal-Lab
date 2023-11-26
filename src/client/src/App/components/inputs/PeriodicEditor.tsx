import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { getLabelInfo, GroupEditorProps } from "./GroupEditor/GroupEditorProps";
import { NumObjEntityEditor } from "./NumObjEntityEditor";

export function PeriodicEditor<LN extends SectionName = SectionName>({
  feId,
  labelInfo,
  labelProps,
  ...rest
}: GroupEditorProps<"periodic", LN>) {
  const feInfo = { sectionName: "periodicEditor", feId } as const;
  const periodicEditor = useGetterSection(feInfo);
  const frequency = periodicEditor.valueNext("valueEditorFrequency");
  const lInfo = getLabelInfo("periodic", frequency, labelInfo);
  return (
    <NumObjEntityEditor
      {...{
        feVarbInfo: periodicEditor.varbInfo2("valueEditor"),
        labelProps: {
          ...labelProps,
          labelInfo: lInfo,
        },
        ...rest,
      }}
    />
  );
}
