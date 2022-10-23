import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useSectionsDispatch } from "../../sharedWithServer/stateClassHooks/useSections";
import { StandardProps } from "../general/StandardProps";
import { XBtn } from "./Xbtn";

interface Props extends StandardProps, FeSectionInfo {}

export const RemoveSectionXBtn = React.memo(function RemoveSectionXBtn({
  className,
  ...rest
}: Props) {
  const dispatch = useSectionsDispatch();
  return (
    <XBtn
      {...{
        className,
        onClick: () =>
          dispatch({
            type: "removeSelf",
            ...rest,
          }),
      }}
    />
  );
});
