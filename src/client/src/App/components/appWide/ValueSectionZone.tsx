import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ValueSectionBtn } from "./ListGroup/ListGroupShared/ValueSectionBtn";
import { OnetimeValue } from "./OnetimeValue";
import { ValueSectionOngoing } from "./OngoingValue";

interface Props<SN extends SectionName, CN extends ChildName<SN>>
  extends FeSectionInfo<SN> {
  childName: CN;
  plusBtnText: string;
  displayName?: string;
  showXBtn?: boolean;
  className?: string;
}

export function ValueSectionZone<
  SN extends SectionName,
  CN extends ChildName<SN>
>({
  childName,
  plusBtnText,
  sectionName,
  feId,
  className,
  ...rest
}: Props<SN, CN>) {
  const section = useSetterSection({ sectionName, feId });
  const hasValueSection = section.get.hasOnlyChild(childName);
  const noValueScenario = () => (
    <ValueSectionBtn
      text={plusBtnText}
      onClick={() => section.addChild(childName)}
    />
  );
  const hasValueScenario = () => {
    const props = {
      feId: section.get.onlyChild(childName).feId,
      ...rest,
    };
    const childSectionName = section.meta.childType(childName);
    switch (childSectionName) {
      case "singleTimeValue":
        return <OnetimeValue {...props} />;
      case "ongoingValue":
        return <ValueSectionOngoing {...props} />;
      default:
        throw new Error(
          `sectionName is "${childSectionName}" but must be either singleTimeValue or ongoingValue`
        );
    }
  };
  return (
    <div className={`ValueSectionZone-root ${className ?? ""}`}>
      {!hasValueSection && noValueScenario()}
      {hasValueSection && hasValueScenario()}
    </div>
  );
}
