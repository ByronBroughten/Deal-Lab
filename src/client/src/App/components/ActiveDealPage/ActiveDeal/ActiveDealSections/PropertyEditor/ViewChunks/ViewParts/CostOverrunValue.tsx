import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectEditor } from "../../../../../../appWide/SelectEditor";
import { VarbLabel } from "../../../../../../appWide/VarbLabel";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

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
        label: <VarbLabel names={feVarbInfo} />,
        unionValueName: "overrunValueSource",
        items: [
          ["valueDollarsEditor", "Custom amount"],
          ["valuePercentEditor", "Custom percent"],
        ],
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
