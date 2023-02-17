import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import StandardLabel from "../../../general/StandardLabel";
import { MaterialStringEditor } from "../../../inputs/MaterialStringEditor";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { CheckboxOrXBtnCell } from "../../ListGroup/ListGroupShared/CheckboxOrXBtnCell";
import { VarbListItemStyledNext } from "../../ListGroup/ListGroupShared/VarbListItemStyledNext";

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
      <td className="VarbListTable-nameCell">
        {displayName ? (
          <StandardLabel className="VarbListTable-nameLabel">
            {displayName}
          </StandardLabel>
        ) : (
          <MaterialStringEditor
            {...{ ...feInfo, varbName: "displayNameEditor" }}
          />
        )}
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
        <span className="ListItemCapEx-equals">{`= ${
          lifespan && costToReplace ? displayValueVarb : "?"
        }`}</span>
      </td>
      <CheckboxOrXBtnCell
        {...{
          ...feInfo,
          checkmarkVarbName: capExItem.hasVarbName("isActive")
            ? "isActive"
            : undefined,
        }}
      />
    </Styled>
  );
});

const Styled = styled(VarbListItemStyledNext)`
  .VarbListTable-nameLabel {
    font-size: 15px;
    color: ${theme.dark};
  }
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

type Props = {
  feId: string;
  sectionName: "capExItem";
};
export function ListItemCapExNext(props: Props) {
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
