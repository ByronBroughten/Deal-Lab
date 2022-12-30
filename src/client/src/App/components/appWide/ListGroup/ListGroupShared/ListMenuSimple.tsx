import React from "react";
import { ListMenuGeneric, ListMenuGenericProps } from "./ListMenuGeneric";

type Props = ListMenuGenericProps;
export function ListMenuSimple({ className, ...rest }: Props) {
  return (
    <ListMenuGeneric
      {...{
        ...rest,
        className: `ListMenuSimple-root ${className ?? ""}`,
        showSaveStatus: false,
        actionMenuProps: {
          alwaysArr: ["createNew"],
          isNotSavedArr: [],
          isSavedArr: [],
        },
      }}
    />
  );
}
