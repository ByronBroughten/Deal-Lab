import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { DisplayNameCell } from "../../ListGroup/ListGroupShared/DisplayNameCell";
import { VarbListItemStyledNext } from "../../ListGroup/ListGroupShared/VarbListItemStyled";
import { XBtnCell } from "../../ListGroup/ListGroupShared/XBtnCell";

interface MemoProps extends Props {
  displayValueVarb: string;
  displayName?: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  displayValueVarb,
  displayName,
  ...feInfo
}: MemoProps) {
  const capExItem = useGetterSection(feInfo);
  const lifespan = capExItem.valueNext("lifespanSpanEditor").mainText;
  const costToReplace = capExItem.valueNext("costToReplace").mainText;
  return (
    <Styled {...{ className: "ListItemCapEx-root" }}>
      <DisplayNameCell {...{ displayName, ...feInfo }} />
      <td className="VarbListTable-firstContentCell">
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
      <td className="VarbListTable-extenderCell">
        <span className="ListItemCapEx-equals">{`= ${
          lifespan && costToReplace ? displayValueVarb : "?"
        }`}</span>
      </td>
      <XBtnCell {...feInfo} />
    </Styled>
  );
});

const Styled = styled(VarbListItemStyledNext)`
  .ListItemCapEx-equals {
    margin-left: ${theme.s2};
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

type Props = {
  feId: string;
  sectionName: "capExItem";
};
export function ListItemCapEx(props: Props) {
  const section = useSetterSection(props);
  const valueVarbName = section.get.activeSwitchTargetName(
    "value",
    "ongoing"
  ) as "valueMonthly";

  const valueVarb = section.varb(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        ...props,
        displayValueVarb: valueVarb.get.displayVarb(),
      }}
    />
  );
}
