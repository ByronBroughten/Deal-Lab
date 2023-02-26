import React from "react";
import { CompletionStatus } from "../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { DealSubSectionDetails } from "./DealSubSectionDetails";
import { DealSubSectionTitleRow } from "./DealSubSectionTitleRow";
import { MainSubSectionClosed } from "./MainSubSectionClosed";

type Props = {
  sectionTitle: React.ReactNode;
  completionStatus: CompletionStatus;
  openEditor: () => void;
  detailsProps?: {
    displayName: React.ReactNode;
    detailVarbPropArr: LabeledVarbProps[];
  };
};
export function DealSubSectionClosed({ detailsProps, ...rest }: Props) {
  const completionStatusProps = {
    allEmpty: { title: "Start Property" },
    someInvalid: { title: "Continue Property" },
    allValid: { title: "Edit Property" },
  };

  return (
    <MainSubSectionClosed
      {...{
        titleRow: <DealSubSectionTitleRow {...rest} />,
        detailsSection: detailsProps && (
          <DealSubSectionDetails {...detailsProps} />
        ),
      }}
    />
  );
}
