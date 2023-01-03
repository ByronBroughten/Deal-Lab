import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ListGroupGenericBtn } from "./ListGroup/ListGroupShared/ListGroupGeneric";
import { SingleTimeValue } from "./SingleTimeValue";

interface Props<SN extends SectionName, CN extends ChildName<SN>>
  extends FeSectionInfo<SN> {
  childName: CN;
  plusBtnText: string;
  displayName: string;
}

export function SingleTimeValueZone<
  SN extends SectionName,
  CN extends ChildName<SN>
>({ childName, displayName, plusBtnText, ...feInfo }: Props<SN, CN>) {
  const section = useSetterSection(feInfo);
  return (
    <>
      {!section.get.hasOnlyChild(childName) && (
        <ListGroupGenericBtn
          text={plusBtnText}
          onClick={() => section.addChild(childName)}
        />
      )}
      {section.get.hasOnlyChild(childName) && (
        <SingleTimeValue
          feId={section.get.onlyChild(childName).feId}
          displayName={displayName}
        />
      )}
    </>
  );
}
