import { Children } from "react";
import styled from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { StandardProps } from "../../../../general/StandardProps";
import AddItemBtn from "../../../AdditiveListNext/AdditiveListTable/AddItemBtn";
import useHowMany from "../../../customHooks/useHowMany";

interface Props extends StandardProps {
  themeName: ThemeName;
  contentTitle: string;
  addItem: () => void;
}

// const contentTitle = listType === "userVarbList" ? "Value" : "Cost";
export function VarbListTable({
  themeName,
  contentTitle,
  children,
  addItem,
}: Props) {
  const { isAtLeastOne, areNone } = useHowMany(Children.toArray(children));
  // const switches = valueSwitches[itemType];
  // const { selectDefaultIsOpen, toggleSelectDefault, closeSelectDefault } =
  //   useToggleView({
  //     initValue: false,
  //     viewWhat: "selectDefault",
  //   });
  // const defaultSwitchVarb = analyzer.feVarb("defaultValueSwitch", feInfo);
  // function updateDefaultSwitch(switchValue: string) {
  //   handleDirectUpdate(aefaultSwitchVarb.feVarbInfo, switchValue);
  // }
  // const selectDefaultHeaderRef = useOnOutsideClickRef(closeSelectDefault, "th");
  // const setDefaultMenuItems = switches.map((switchValue) => ({
  //   onClick: () => updateDefaultSwitch(switchValue),
  //   displayValue: switchValueToDisplay[switchValue],
  //   switchValue,
  // }));
  // const defaultValueSwitch = defaultSwitchVarb.value("string");

  return (
    <Styled className="AdditiveListTable-root" themeName={themeName}>
      {areNone && (
        // <BtnTooltip
        //   title="Add list item"
        //   className="AdditiveListTable-addItemBtn noTable"
        // >
        <AddItemBtn onClick={addItem} className="noTable" />
        // </BtnTooltip>
      )}
      {isAtLeastOne && (
        <table className="AdditiveListTable-table">
          <thead>
            <tr>
              <th className="AdditiveListTable-nameHeader">Name</th>
              <th className="AdditiveListTable-contentHeader">
                {contentTitle}
              </th>
              <th colSpan={2} className="AdditiveListTable-buttonHeader">
                <AddItemBtn className="yesTable" onClick={addItem} />
              </th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      )}
    </Styled>
  );
}

const Styled = styled.div<{
  themeName: ThemeName;
}>`
  .AdditiveListTable-addItemBtn {
    font-weight: 900;
    height: ${theme.unlabeledInputHeight};
    width: 50px;
  }
  .AdditiveListTable-addItemBtn.noTable {
    width: 100%;
    margin-top: ${theme.s1};
  }

  .AdditiveListTable-table {
    ${({ themeName }) => ccs.listTable.main(themeName)}
  }
  th.AdditiveListTable-nameHeader {
    text-align: left;
  }
  th.AdditiveListTable-contentHeader,
  th.AdditiveListTable-buttonHeader {
    text-align: center;
  }

  th.AdditiveListTable-nameHeader,
  td.AdditiveItem-nameCell {
    background: ${theme["gray-200"]};
  }

  th.AdditiveListTable-contentHeader,
  td.AdditiveItem-contentCell {
    border-left: 1px solid ${({ themeName }) => theme[themeName].border};
  }

  .AdditiveItem-contentCellDiv {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;
