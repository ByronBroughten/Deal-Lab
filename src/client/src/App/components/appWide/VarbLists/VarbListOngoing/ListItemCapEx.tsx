import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import { MaterialStringEditor } from "../../../inputs/MaterialStringEditor";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";

interface MemoProps {
  feId: string;
  displayValueVarb: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
  displayValueVarb,
}: MemoProps) {
  const feInfo = { sectionName: "capExItem", feId } as const;
  const capExItem = useGetterSection(feInfo);
  const lifespan = capExItem.valueNext("lifespanSpanEditor").mainText;
  const costToReplace = capExItem.valueNext("costToReplace").mainText;
  return (
    <Styled
      {...{
        ...feInfo,
        className: "ListItemCapEx-root",
        useXBtn: true,
        firstCells: (
          <>
            <td className="VarbListTable-nameCell">
              <MaterialStringEditor
                {...{ ...feInfo, varbName: "displayNameEditor" }}
              />
            </td>
            <td className="ListItemCapEx-cell VarbListTable-firstContentCell">
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
            </td>
            <td className="ListItemCapEx-cell">
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
            <td className="ListItemCapEx-cell">
              {lifespan && costToReplace && (
                <span className="ListItemCapEx-equals">{`= ${displayValueVarb}`}</span>
              )}
            </td>
          </>
        ),
      }}
    />
  );
});

const Styled = styled(VarbListItemStyled)`
  .ListItemCapEx-equals {
    margin-left: ${theme.s2};
  }
  td.ListItemCapEx-cell {
  }

  .ListItemCapEx-lifespan {
    .DraftEditor-root {
      min-width: 46px;
    }
  }

  .ListItemCapEx-costToReplace {
    .DraftEditor-root {
      min-width: 93px;
    }
  }
`;

type Props = { feId: string };
export function ListItemCapEx({ feId }: Props) {
  const section = useSetterSection({ sectionName: "capExItem", feId });
  const valueVarbName = section.get.activeSwitchTargetName(
    "value",
    "ongoing"
  ) as "valueMonthly";

  const valueVarb = section.varb(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        feId,
        displayValueVarb: valueVarb.get.displayVarb(),
      }}
    />
  );
}
