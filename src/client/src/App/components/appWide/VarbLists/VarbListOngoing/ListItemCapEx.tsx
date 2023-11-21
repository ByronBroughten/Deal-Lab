import { Box } from "@mui/material";
import React from "react";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { NameEditorCell } from "../../ListGroup/ListGroupShared/NameEditorCell";
import { FirstContentCell } from "../../ListGroup/ListGroupShared/VarbListGeneric/FirstContentCellAndHeader";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";
import { XBtnCell } from "../../ListGroup/ListGroupShared/XBtnCell";

interface MemoProps extends Props {
  displayValueVarb: string;
  displayName?: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  displayValueVarb,
  displayName,
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "capExItem", feId } as const;
  const capExItem = useGetterSection(feInfo);
  const lifespan = capExItem.valueNext("lifespanSpanEditor").mainText;
  const costToReplace = capExItem.valueNext("costToReplace").mainText;
  return (
    <VarbListItemStyled
      {...{
        className: "ListItemCapEx-root",
        sx: {
          "& .ListItemCapEx-lifespan": {
            "& .DraftEditor-root": {
              minWidth: "28px",
            },
          },
          "& .ListItemCapEx-costToReplace": {
            "& .DraftEditor-root": {
              minWidth: "93px",
            },
          },
        },
      }}
    >
      <NameEditorCell {...{ displayName, ...feInfo }} />
      <FirstContentCell>
        <NumObjEntityEditor
          className="ListItemCapEx-costToReplace"
          labeled={false}
          feVarbInfo={{
            ...feInfo,
            varbName: "costToReplace",
          }}
          editorType="equation"
          quickViewVarbNames={["numUnits", "numBedrooms", "sqft"]}
        />
      </FirstContentCell>
      <td>
        <NumObjEntityEditor
          className="ListItemCapEx-lifespan"
          editorType="equation"
          labeled={false}
          feVarbInfo={{
            ...feInfo,
            varbName: "lifespanSpanEditor",
          }}
        />
      </td>
      <td>=</td>
      <td>
        <Box component={"span"} sx={{ fontSize: "17px" }}>
          {`${lifespan && costToReplace ? displayValueVarb : "?"}`}
        </Box>
      </td>
      <XBtnCell {...feInfo} />
    </VarbListItemStyled>
  );
});

type Props = { feId: string };
export function ListItemCapEx({ feId }: Props) {
  const section = useGetterSection({ sectionName: "capExItem", feId });
  const valueVarbName = "valueDollarsMonthly";
  const valueVarb = section.varbNext(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        ...section.feInfo,
        displayValueVarb: valueVarb.displayVarb(),
      }}
    />
  );
}
