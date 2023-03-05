import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ValueSectionBtn } from "./ListGroup/ListGroupShared/ValueSectionBtn";
import { SingleTimeValue } from "./SingleTimeValue";

interface Props<SN extends SectionName, CN extends ChildName<SN>>
  extends FeSectionInfo<SN> {
  childName: CN;
  plusBtnText: string;
  displayName?: string;
  showXBtn?: boolean;
  className?: string;
}
export function ValueSectionOneTimeZone<
  SN extends SectionName,
  CN extends ChildName<SN>
>({ childName, plusBtnText, sectionName, feId, ...rest }: Props<SN, CN>) {
  const section = useSetterSection({ sectionName, feId });
  const hasValueSection = section.get.hasOnlyChild(childName);
  return (
    <>
      {!hasValueSection && (
        <ValueSectionBtn
          text={plusBtnText}
          onClick={() => section.addChild(childName)}
          className={rest.className}
        />
      )}
      {hasValueSection && (
        <SingleTimeValue
          {...{
            feId: section.get.onlyChild(childName).feId,
            ...rest,
          }}
        />
      )}
    </>
  );
}
