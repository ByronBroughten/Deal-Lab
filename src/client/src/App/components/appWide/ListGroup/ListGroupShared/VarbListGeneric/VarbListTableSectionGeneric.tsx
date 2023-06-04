import React, { Children } from "react";
import { StandardProps } from "../../../../general/StandardProps";
import { VarbListTableSectionStyled } from "./VarbListTableSectionStyled";

interface Props extends StandardProps {
  addItem: () => void;
  headers: React.ReactNode;
  varbListTotal?: React.ReactNode;
}

export function VarbListTableSectionGeneric({
  children,
  addItem,
  headers,
  varbListTotal,
}: Props) {
  return (
    <VarbListTableSectionStyled
      varbListTotal={varbListTotal}
      headers={headers}
      rows={children}
      rowCount={Children.toArray(children).length}
      addItem={addItem}
    />
  );
}
