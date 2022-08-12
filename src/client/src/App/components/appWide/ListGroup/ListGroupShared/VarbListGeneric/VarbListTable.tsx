import { Children } from "react";
import styled, { css } from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { StandardProps } from "../../../../general/StandardProps";
import useHowMany from "../../../customHooks/useHowMany";
import { AddItemBtn } from "../AddItemBtn";

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
    <Styled className="AdditiveListTable-root" $themeName={themeName}>
      {areNone && <AddItemBtn onClick={addItem} className="noTable" />}
      {isAtLeastOne && (
        <table className="AdditiveListTable-table">
          <thead>
            <tr>
              <th className="AdditiveListTable-nameHeader">Name</th>
              <th className="AdditiveListTable-contentHeader">
                {contentTitle}
              </th>
              <th colSpan={2} className="AdditiveListTable-buttonHeader">
                {/* <AddItemBtn className="yesTable" onClick={addItem} /> */}
              </th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
          <td colSpan={4}>
            <AddItemBtn onClick={addItem} className="yesTable" />
          </td>
        </table>
      )}
    </Styled>
  );
}

// This is close. But I only want the
// edge of the table to expand.
// That's not true.
// I actually only want the middle of the table to expand.
// I could have two tables with a flex thing in the middle

// I could try making my own table rows.
// I would have to use separate divs like I did for the
// if-then variables. It could work. It would just take
// some time.

const Styled = styled.div<{
  $themeName: ThemeName;
}>`
  .AdditiveListTable-addItemBtn {
    ${({ $themeName }) =>
      css`
        background: ${theme[$themeName].light};
        border: none;
        :hover,
        :active {
          background: ${theme[$themeName].dark};
          border: 1px solid ${theme[$themeName].main};
        }
      `}
    font-weight: 900;
    height: ${theme.unlabeledInputHeight};
    width: 100%;
  }

  .AdditiveListTable-table {
    ${({ $themeName }) => ccs.listTable.main($themeName)}
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
    border-left: 1px solid ${({ $themeName }) => theme[$themeName].border};
  }

  .AdditiveItem-contentCellDiv {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;
