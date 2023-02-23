import { AiOutlineUnorderedList } from "react-icons/ai";
import styled, { css } from "styled-components";
import { ListChildName } from "../../sharedWithServer/SectionsMeta/allSectionChildren";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { MainSectionFancyStyled } from "../ActiveDealPage/ActiveDeal/MainSectionFancyStyled";
import { MainSectionLargeEditBtn } from "../ActiveDealPage/ActiveDeal/MainSectionLargeEditBtn";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListSingleTime } from "../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { SectionTitle } from "../appWide/SectionTitle";
import { VarbListCapEx } from "../appWide/VarbLists/VarbListCapEx";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

const listTypeNames = ["capEx", "ongoing", "singleTime"] as const;
type ListTypeName = typeof listTypeNames[number];

type ListProps = Record<
  ListChildName,
  {
    title: string;
    listTypeName: ListTypeName;
  }
>;
const listProps: ListProps = {
  repairsListMain: {
    title: "Repairs",
    listTypeName: "singleTime",
  },
  utilitiesListMain: {
    title: "Utilities",
    listTypeName: "ongoing",
  },
  holdingCostsListMain: {
    title: "Holding Costs",
    listTypeName: "ongoing",
  },
  capExListMain: {
    title: "Capital Expenses",
    listTypeName: "capEx",
  },
  closingCostsListMain: {
    title: "Closing Costs",
    listTypeName: "ongoing",
  },
  outputListMain: {
    title: "Outputs Collections",
    listTypeName: "singleTime",
  },
  singleTimeListMain: {
    title: "Custom One-time Costs",
    listTypeName: "singleTime",
  },
  ongoingListMain: {
    title: "Custom Ongoing Costs",
    listTypeName: "ongoing",
  },
};

type Props = {
  listName: ListChildName;
  openInputs: () => void;
  closeInputs: () => void;
  showInputs: boolean;
  hide: boolean;
  className?: string;
};

const listNodeMakers: Record<ListTypeName, MakeListNode> = {
  singleTime: (nodeProps) => (
    <VarbListSingleTime {...{ ...nodeProps, menuType: "editorPage" }} />
  ),
  ongoing: (nodeProps) => (
    <VarbListOngoing {...{ ...nodeProps, menuType: "editorPage" }} />
  ),
  capEx: (nodeProps) => (
    <VarbListCapEx
      {...{
        ...nodeProps,
        menuType: "editorPage",
      }}
    />
  ),
};

export function UserListEditorSection({
  openInputs,
  closeInputs,
  listName,
  ...rest
}: Props) {
  const { title, listTypeName } = listProps[listName];
  const userListEditor = useSetterSectionOnlyOne("userListEditor");
  return (
    <Styled
      {...{
        ...rest,
        $showInputs: rest.showInputs,
        className: `UserListsEditorSection-root ${rest.className ?? ""}`,
        noInputsTitleRow: (
          <>
            <SectionTitle
              className="UserListEditorSection-title"
              text={title}
            />
            <MainSectionLargeEditBtn
              {...{
                className: "UserListEditorSection-editIcon",
                middle: <AiOutlineUnorderedList size={20} />,
                onClick: openInputs,
              }}
            />
          </>
        ),
        inputSection: (
          <>
            <UserEditorTitleRow
              goBackToLists={closeInputs}
              titleText={title}
              sectionName="userListEditor"
              childNames={[listName]}
            />
            <div className="UserListEditor-listGroups">
              <ListGroupGeneric
                {...{
                  titleText: title,
                  listParentInfo: userListEditor.feInfo,
                  listAsChildName: listName,
                  makeListNode: listNodeMakers[listTypeName],
                }}
              />
            </div>
          </>
        ),
      }}
    />
  );
}

const Styled = styled(MainSectionFancyStyled)<{ $showInputs: boolean }>`
  ${({ $showInputs }) =>
    !$showInputs &&
    css`
      padding-top: ${theme.s25};
      padding-bottom: ${theme.s25};
      padding-right: ${theme.s25};
      .MainDealSection-detailsDiv {
        display: none;
      }
    `}
  .UserListEditor-listGroups {
    margin-top: ${theme.s35};
  }
  .UserListEditorSection-title {
    width: 200px;
  }
`;
