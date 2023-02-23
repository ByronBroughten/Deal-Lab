import React from "react";
import styled, { css } from "styled-components";
import { listChildrenNames } from "../../sharedWithServer/SectionsMeta/allSectionChildren";
import { Arr } from "../../sharedWithServer/utils/Arr";
import theme from "../../theme/Theme";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { SectionTitle } from "../appWide/SectionTitle";
import { LabelWithInfo } from "./../appWide/LabelWithInfo";
import { UserListEditorSection } from "./UserListEditorSection";

const orderedListNames = Arr.extractOrder(listChildrenNames, [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "closingCostsListMain",
  "singleTimeListMain",
  "ongoingListMain",
]);
type ListName = typeof orderedListNames[number];

const mainViewName = "userLists";
type ViewName = ListName | typeof mainViewName;

export function UserLists() {
  const [sectionView, setSectionView] = React.useState("userLists" as ViewName);

  const makeSectionProps = (listName: ListName) => {
    return {
      key: listName,
      listName,
      showInputs: sectionView === listName,
      openInputs: () => setSectionView(listName),
      closeInputs: () => setSectionView(mainViewName),
      hide: ![listName, mainViewName].includes(sectionView),
    };
  };

  const showLists = sectionView === "userLists";
  return (
    <Styled $showLists={showLists}>
      {showLists && (
        <SectionTitle
          {...{
            text: (
              <LabelWithInfo
                {...{
                  label: "Lists",
                  infoTitle: "Lists",
                  infoText: `Here you'll find different kinds of lists you can edit, create, and use as templates throughout the app. This is to reduce repetition when itemizing values to estimate costs for things like utilities and CapEx.`,
                }}
              />
            ),
          }}
        />
      )}
      {orderedListNames.map((listName) => (
        <UserListEditorSection {...makeSectionProps(listName)} />
      ))}
    </Styled>
  );
}

const Styled = styled(OuterMainSection)<{ $showLists: boolean }>`
  ${({ $showLists }) =>
    $showLists &&
    css`
      .UserListsEditorSection-root {
        margin-top: ${theme.dealElementSpacing};
      }
    `}
`;
