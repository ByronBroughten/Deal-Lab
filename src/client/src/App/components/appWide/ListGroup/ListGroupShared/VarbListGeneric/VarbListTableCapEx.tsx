import React, { Children } from "react";
import { StandardProps } from "../../../../general/StandardProps";
import { FirstContentHeader } from "./FirstContentCellAndHeader";
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
          <FirstContentHeader>Cost to Replace</FirstContentHeader>
          <th className="VarbListTable-lifespanHeader">Lifespan</th>
          <th></th>
          <th>Budget</th>
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
