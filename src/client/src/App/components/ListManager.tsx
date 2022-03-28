import React from "react";
import styled from "styled-components";
import theme from "../theme/Theme";
import AdditiveList from "./appWide/AdditiveList";
import GeneralSectionTitle from "./appWide/MainSection/GeneralSectionTitle";
import ListManagerTitleRow from "./ListManager/ListManagerTitleRow";
import {
  AnalyzerContext,
  useAnalyzerContext,
} from "../modules/usePropertyAnalyzer";
import MainSection from "./appWide/MainSection";
import useLmAnalyzer from "./ListManager/useLmAnalyzer";
import { SectionName } from "../sharedWithServer/Analyzer/SectionMetas/SectionName";

export function useListManager(sectionName: SectionName<"userList">) {
  const { analyzer: mainAnalyzer, setAnalyzer: setMainAnalyzer } =
    useAnalyzerContext();

  const lmContext = useLmAnalyzer({
    sectionName,
    mainAnalyzer,
    setMainAnalyzer,
  });

  const userListIds = lmContext.analyzer
    .singleSection("main")
    .childFeIds(sectionName);

  return {
    ...lmContext,
    userListIds,
  };
}

const titles: Record<SectionName<"userList">, string> = {
  userVarbList: "Variables",
  userSingleList: "One time costs",
  userOngoingList: "Ongoing costs: ",
};

type Props = { sectionName: SectionName<"userList"> };
export default function ListManager({ sectionName }: Props) {
  const {
    discardChanges,
    disableUndo,
    undoEraseSection,
    didChange,
    userListIds,
    saveUserLists,
    ...vmContext
  } = useListManager(sectionName);

  return (
    <AnalyzerContext.Provider value={vmContext}>
      <Styled sectionName={sectionName}>
        <GeneralSectionTitle
          title={titles[sectionName]}
          sectionName={sectionName}
        />
        <div className="ListManager-entry">
          {/* <Prompt when={didChange} message={"Close without saving changes?"} /> */}
          <ListManagerTitleRow
            {...{
              sectionName,
              disableUndo,
              undoEraseSection,
              didChange,
              saveUserLists,
              discardChanges,
            }}
          />
          <div className="ListManager-collections">
            {userListIds.map((id) => (
              <AdditiveList
                {...{
                  feInfo: { sectionName, id, idType: "feId" },
                  themeSectionName: sectionName,
                  listType: sectionName,
                }}
              />
            ))}
          </div>
        </div>
      </Styled>
    </AnalyzerContext.Provider>
  );
}

const Styled = styled(MainSection)`
  position: relative;
  z-index: 0;

  .ListManager-entry {
    overflow: auto;
    width: 100%;
    padding: ${theme.s3};
  }

  .ListManager-collections {
    display: flex;
    margin: ${theme.s2};

    .AdditiveList-root {
      margin: ${theme.s2};
    }
  }
`;
