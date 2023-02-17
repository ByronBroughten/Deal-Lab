import React, { Children } from "react";
import styled from "styled-components";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableStyled } from "./VarbListTableStyled";

interface Props extends StandardProps {
  addItem: () => void;
  total?: React.ReactNode;
}

export function VarbListTableCapEx({
  children,
  addItem,
  total,
  ...rest
}: Props) {
  return (
    <Styled
      addItemBtnMiddle="+ Custom Item"
      headers={
        <tr>
          <th className="VarbListTable-nameHeader">Name</th>
          <th className="VarbListTable-replacementCostHeader VarbListTable-firstContentHeader">
            Cost to Replace
          </th>
          <th className="VarbListTable-lifespanHeader">Lifespan</th>
          <th className="VarbListTable-budgetHeader VarbListTable-lastHeader">
            Budget
          </th>
          <th className="VarbListTable-btnHeader VarbListTable-lastHeader"></th>
        </tr>
      }
      rows={children}
      rowCount={Children.toArray(children).length}
      {...{
        addItem,
        varbListTotal: total,
        ...rest,
      }}
    />
  );
}

const Styled = styled(VarbListTableStyled)``;
