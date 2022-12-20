import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../../theme/Theme";
import { ListGroupGenericBtn } from "../../../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { ListGroupSingleTime } from "../../../appWide/ListGroup/ListGroupSingleTime";

interface Props<SN extends SectionName, CN extends ChildName<SN>>
  extends FeSectionInfo<SN> {
  childName: CN;
  themeName: ThemeName;
  btnText: string;
  titleText: string;
}
export function ListGroupSingleTimeZone<
  SN extends SectionName,
  CN extends ChildName<SN>
>({ childName, btnText, titleText, themeName, ...feInfo }: Props<SN, CN>) {
  const section = useSetterSection(feInfo);
  return (
    <>
      {!section.get.hasOnlyChild(childName) && (
        <ListGroupGenericBtn
          text={btnText}
          onClick={() => section.addChild(childName)}
        />
      )}
      {section.get.hasOnlyChild(childName) && (
        <ListGroupSingleTime
          feId={section.get.onlyChild(childName).feId}
          titleText={titleText}
          themeName={themeName}
        />
      )}
    </>
  );
}
