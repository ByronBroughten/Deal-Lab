import { Children } from "react";
import styled from "styled-components";
import { ThemeName } from "../../../../../theme/Theme";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableStyled } from "./VarbListTableStyled";

interface Props extends StandardProps {
  themeName?: ThemeName;
  contentTitle: string;
  addItem: () => void;
}

// const contentTitle = listType === "userVarbList" ? "Value" : "Cost";
export function VarbListTableGeneric({
  contentTitle,
  children,
  addItem,
}: Props) {
  return (
    <Styled
      headers={
        <tr>
          <th className="VarbListTable-nameHeader">Name</th>
          <th className="VarbListTable-firstContentHeader">{contentTitle}</th>
          <th className="VarbListTable-btnHeader"></th>
        </tr>
      }
      rows={children}
      rowCount={Children.toArray(children).length}
      addItem={addItem}
    />
  );
}

const Styled = styled(VarbListTableStyled)`
  .AdditiveItem-contentCellDiv {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: flex-end;
  }
`;
