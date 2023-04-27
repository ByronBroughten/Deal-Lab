import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectEditorNext } from "../../../../appWide/SelectEditorNext";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; sx?: SxProps };
export function CostOverrunValue({ feId, sx }: Props) {
  const feInfo = { sectionName: "costOverrunValue", feId } as const;
  const costOverrun = useGetterSection(feInfo);
  const valueSource = costOverrun.valueNext("valueSourceName");
  const equalsVarbName =
    valueSource === "valueDollarsEditor" ? "valuePercent" : "valueDollars";
  return (
    <SelectEditorNext
      {...{
        sx,
        selectProps: { sx: { minWidth: 160 } },
        label: "Cost overrun",
        unionValueName: "overrunValueSource",
        items: [
          ["valueDollarsEditor", "Dollar amount"],
          ["valuePercentEditor", "Percent"],
        ],
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        makeEditor: (props) => (
          <NumObjEntityEditor
            {...{
              ...props,
              feVarbInfo: {
                ...feInfo,
                varbName: valueSource,
              },
            }}
          />
        ),
        equalsValue: costOverrun.displayVarb(equalsVarbName),
      }}
    />
  );
}
