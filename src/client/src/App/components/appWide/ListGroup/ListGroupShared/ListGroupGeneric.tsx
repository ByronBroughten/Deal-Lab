import styled from "styled-components";
import { VarbName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import {
  ChildNameOfType,
  ParentOfTypeName,
  SectionNameByType,
} from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { GetterSection } from "../../../../sharedWithServer/StateGetters/GetterSection";
import theme, { ThemeName } from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import useHowMany from "../../customHooks/useHowMany";
import { SectionBtn } from "../../SectionBtn";
import { SectionTitleAndCost } from "../../SectionTitleAndCost";
import {
  ListGroupLists,
  MakeListNode,
} from "./ListGroupGeneric/ListGroupLists";

type ListParentName = ParentOfTypeName<"varbListAllowed">;

export type ListGroupGenericProps<SN extends ListParentName> = {
  listParentInfo: FeSectionInfo<SN>;
  listAsChildName: ChildName<SN>;
  themeName?: ThemeName;
  makeListNode: MakeListNode;
  titleText: string;
  totalVarbName?: VarbName<SN>;
  className?: string;
};

export function ListGroupGeneric<
  SN extends ListParentName,
  CN extends ChildNameOfType<SN, "varbListAllowed">
>({
  themeName,
  listParentInfo,
  listAsChildName,
  makeListNode,
  titleText,
  totalVarbName,
  className,
}: ListGroupGenericProps<SN>) {
  const parent = useSetterSection(listParentInfo);
  const lists = parent.get.children(
    listAsChildName
  ) as GetterSection<any>[] as GetterSection<
    ChildSectionName<SN, CN> & SectionNameByType<"varbListAllowed">
  >[];

  const numListsWithItems = lists.reduce<number>((num, list) => {
    const itemName = list.meta.varbListItem as ChildName<
      ChildSectionName<SN, CN>
    >;
    const childIds = list.childFeIds(itemName as any);
    if (childIds.length > 0) num++;
    return num;
  }, 0);

  const { areMultiple: areMultipleLists } = useHowMany(lists);
  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        <div className="ListGroup-titleRow">
          <SectionTitleAndCost
            className="ListGroup-titleRowLeft"
            text={titleText}
            cost={
              areMultipleLists && numListsWithItems > 1 && totalVarbName
                ? parent.get.varbNext(totalVarbName).displayVarb()
                : undefined
            }
          />
          <div className="listGroup-titleRowRight"></div>
        </div>
        <ListGroupLists
          {...{
            themeName,
            feIds: lists.map(({ feId }) => feId),
            makeListNode,
            addList: () => parent.addChild(listAsChildName),
          }}
        />
      </div>
    </Styled>
  );
}

interface BtnProps extends StandardBtnProps {
  text?: React.ReactNode;
  icon?: React.ReactNode;
}
export function ListGroupGenericBtn({ className, ...props }: BtnProps) {
  return (
    <BtnStyled className={`ListGroup-root ${className ?? ""}`} {...props} />
  );
}

const BtnStyled = styled(SectionBtn)`
  ${theme.sectionBorderChunk};
  padding: ${theme.sectionPadding};
  height: 260px;
  width: 200px;
  font-size: ${theme.titleSize};
`;

const Styled = styled.div`
  ${theme.sectionBorderChunk};
  padding: ${theme.sectionPadding};

  .ListGroup-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .ListGroup-titleRowLeft {
    display: flex;
    align-items: center;
    padding-left: ${theme.s1};
  }
`;
