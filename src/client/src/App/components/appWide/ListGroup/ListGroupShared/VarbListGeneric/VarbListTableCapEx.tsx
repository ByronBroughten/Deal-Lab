import React, { Children } from "react";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableSectionStyled } from "./VarbListTableSectionStyled";

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
    <VarbListTableSectionStyled
      addItemBtnMiddle="+"
      headers={
        <tr>
          <th className="VarbListTable-nameHeader">Name</th>
          <th className="VarbListTable-replacementCostHeader VarbListTable-firstContentHeader">
            Cost to Replace
          </th>
          <th className="VarbListTable-lifespanHeader">Lifespan</th>
          <th className="VarbListTable-budgetHeader VarbListTable-extenderHeader">
            Budget
          </th>
          <th className="VarbListTable-btnHeader"></th>
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
