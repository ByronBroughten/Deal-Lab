import { Children } from "react";
import styled from "styled-components";
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
  return (
    <Styled className="VarbListTable-root" $themeName={themeName}>
      {areNone && <AddItemBtn onClick={addItem} className="noTable" />}
      {isAtLeastOne && (
        <div className="VarbListTable-tableContainer">
          <table className="VarbListTable-table">
            <thead>
              <tr>
                <th className="VarbListTable-nameHeader">Name</th>
                <th className="AdditiveListTable-contentHeader">
                  {contentTitle}
                </th>
                <th colSpan={2} className="AdditiveListTable-buttonHeader"></th>
              </tr>
            </thead>
            <tbody>
              {children}
              {/* <tr>
              <td colSpan={4} className="VarbListTable-addItemCell">
                <AddItemBtn onClick={addItem} className="yesTable" />
              </td>
            </tr> */}
            </tbody>
          </table>
          <AddItemBtn
            onClick={addItem}
            className="VarbListTable-addItemBtn tableBottom"
          />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div<{
  $themeName: ThemeName;
}>`
  .VarbListTable-addItemBtn.tableBottom {
    border-top: none;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  .VarbListTable-tableContainer {
    display: inline-block;
  }

  .VarbListTable-table {
    ${({ $themeName }) => ccs.listTable.main($themeName)}
  }
  th.VarbListTable-nameHeader {
    text-align: left;
  }
  th.AdditiveListTable-contentHeader,
  th.AdditiveListTable-buttonHeader {
    text-align: center;
  }

  th.VarbListTable-nameHeader,
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
