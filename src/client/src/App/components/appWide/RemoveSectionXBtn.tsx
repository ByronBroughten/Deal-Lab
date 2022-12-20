import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useRemoveSelf } from "../../sharedWithServer/stateClassHooks/useReduceActions";
import { StandardProps } from "../general/StandardProps";
import { XBtn } from "./Xbtn";

interface Props extends StandardProps, FeSectionInfo {}

export const RemoveSectionXBtn = React.memo(function RemoveSectionXBtn({
  className,
  ...rest
}: Props) {
  const removeSelf = useRemoveSelf();
  return (
    <XBtn
      {...{
        className,
        onClick: () => removeSelf(rest),
      }}
    />
  );
});
