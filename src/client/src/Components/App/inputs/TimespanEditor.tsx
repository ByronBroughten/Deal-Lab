import { useGetterSection } from "../../../modules/stateHooks/useGetterSection";
import { SectionName } from "../../../sharedWithServer/stateSchemas/schema2SectionNames";
import { getLabelInfo, GroupEditorProps } from "./GroupEditor/GroupEditorProps";
import { NumObjEntityEditor } from "./NumObjEntityEditor";

export function TimespanEditor<LN extends SectionName = SectionName>({
  feId,
  labelInfo,
  labelProps,
  ...rest
}: GroupEditorProps<"timespan", LN>) {
  const feInfo = { sectionName: "timespanEditor", feId } as const;
  const timespanEditor = useGetterSection(feInfo);
  const valueUnit = timespanEditor.valueNext("valueEditorUnit");
  const lInfo = getLabelInfo("timespan", valueUnit, labelInfo);
  return (
    <NumObjEntityEditor
      {...{
        feVarbInfo: timespanEditor.varbInfo2("valueEditor"),
        labelProps: {
          ...labelProps,
          labelInfo: lInfo,
        },
        ...rest,
      }}
    />
  );
}
