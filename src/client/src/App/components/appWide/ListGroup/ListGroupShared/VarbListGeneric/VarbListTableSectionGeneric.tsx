import React, { Children } from "react";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableSectionStyled } from "./VarbListTableSectionStyled";

interface Props extends StandardProps {
  contentTitle: string;
  addItem: () => void;
  varbListTotal?: React.ReactNode;
}

export function VarbListTableSectionGeneric({
  contentTitle,
  children,
  addItem,
  varbListTotal,
}: Props) {
  return (
    <VarbListTableSectionStyled
      varbListTotal={varbListTotal}
      headers={
        <tr>
          <th className="VarbListTable-nameHeader">Name</th>
          <th className="VarbListTable-firstContentHeader VarbListTable-extensionHeader">
            {contentTitle}
          </th>
          <th className="VarbListTable-btnHeader"></th>
        </tr>
      }
      rows={children}
      rowCount={Children.toArray(children).length}
      addItem={addItem}
    />
  );
}
