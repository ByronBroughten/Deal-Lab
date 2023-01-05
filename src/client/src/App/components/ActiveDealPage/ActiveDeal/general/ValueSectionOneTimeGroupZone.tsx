import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../../theme/Theme";
import { SubSectionGroupBtn } from "../../../appWide/ListGroup/ListGroupShared/SubSectionGroupBtn";
import { ValueGroupSingleTime } from "../../../appWide/ListGroup/ValueGroupSingleTime";

interface Props<SN extends SectionName, CN extends ChildName<SN>>
  extends FeSectionInfo<SN> {
  childName: CN;
  themeName: ThemeName;
  btnText: string;
  titleText: string;
}
export function ValueSectionOneTimeGroupZone<
  SN extends SectionName,
  CN extends ChildName<SN>
>({ childName, btnText, titleText, themeName, ...feInfo }: Props<SN, CN>) {
  const section = useSetterSection(feInfo);
  return (
    <>
      {!section.get.hasOnlyChild(childName) && (
        <SubSectionGroupBtn
          text={btnText}
          onClick={() => section.addChild(childName)}
        />
      )}
      {section.get.hasOnlyChild(childName) && (
        <ValueGroupSingleTime
          feId={section.get.onlyChild(childName).feId}
          titleText={titleText}
        />
      )}
    </>
  );
}
