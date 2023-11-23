import { SnVarbNames } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEntityEditor } from "./NumObjEntityEditor";

type Props = {
  feId: string;
  labelNames: SnVarbNames;
  inputMargins?: boolean;
};
export function PeriodicEditor({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "periodicEditor", feId } as const;
  const timespanEditor = useGetterSection(feInfo);
  return (
    <NumObjEntityEditor
      {...{
        feVarbInfo: timespanEditor.varbInfo("valueEditor"),
        endAdornment: ` ${timespanEditor.valueNext("valueEditorFrequency")}`,
        ...rest,
      }}
    />
  );
}
