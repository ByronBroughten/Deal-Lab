import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
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
        label: (
          <LabelWithInfo
            {...{
              label: "Cost overrun",
              infoTitle: "Cost Overrun",
              infoText: `Cost overrun is the sum of costs over the entirety of a project that were not anticipated upfront. Cost overrun is common, especially for larger projects.\n\nFor sizable rehab projects, it's common to factor in an extra 10-15% of the base rehab estimate for cost overrun. That may not be necessary for turnkey properties or light rehab.`,
            }}
          />
        ),
        unionValueName: "overrunValueSource",
        items: [
          ["valueDollarsEditor", "Custom amount"],
          ["valuePercentEditor", "Custom percent"],
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
