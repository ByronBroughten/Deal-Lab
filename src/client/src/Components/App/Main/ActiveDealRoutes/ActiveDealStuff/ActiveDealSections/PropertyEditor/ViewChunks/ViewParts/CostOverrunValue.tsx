import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../../../../stateHooks/useGetterSection";
import { SelectEditor } from "../../../../../../../appWide/SelectEditor";
import { VarbStringLabel } from "../../../../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; sx?: SxProps };
export function CostOverrunValue({ feId, sx }: Props) {
  const feInfo = { sectionName: "costOverrunValue", feId } as const;
  const costOverrun = useGetterSection(feInfo);
  const valueSource = costOverrun.valueNext("valueSourceName");
  const equalsVarbName =
    valueSource === "valueDollarsEditor" ? "valuePercent" : "valueDollars";
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectEditor
      {...{
        sx,
        selectProps: { sx: { minWidth: 160 } },
        feVarbInfo,
        label: <VarbStringLabel names={feVarbInfo} />,
        unionValueName: "overrunValueSource",
        items: [
          ["valueDollarsEditor", "Amount"],
          ["valuePercentEditor", "Percent"],
        ],
        makeEditor: (props) => (
          <NumObjEntityEditor
            {...{
              ...props,
              labelProps: { showLabel: false },
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
