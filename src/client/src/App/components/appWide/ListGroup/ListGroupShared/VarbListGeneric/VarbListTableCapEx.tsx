import { Children } from "react";
import styled from "styled-components";
import { ThemeName } from "../../../../../theme/Theme";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableStyled } from "./VarbListTableStyled";

interface Props extends StandardProps {
  themeName?: ThemeName;
  addItem: () => void;
}

export function VarbListTableCapEx({ children, addItem }: Props) {
  return (
    <Styled
      headers={
        <>
          <th className="VarbListTable-nameHeader">Name</th>
          <th className="VarbListTable-replacementCostHeader">
            Cost to Replace
          </th>
          <th className="VarbListTable-firstContentHeader VarbListTable-lifespanHeader">
            Lifespan
          </th>
          <th className="AdditiveListTable-budgetHeader">Budget</th>
          <th className="AdditiveListTable-buttonHeader"></th>
        </>
      }
      rows={children}
      rowCount={Children.toArray(children).length}
      addItem={addItem}
    />
  );
}

const Styled = styled(VarbListTableStyled)``;
