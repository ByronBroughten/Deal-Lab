import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useSectionArrQueries } from "../../modules/QueriersRelative/SectionArrAnalyzerQuerier";
import usePropertyAnalyzer from "../../modules/usePropertyAnalyzer";
import Analyzer from "../../sharedWithServer/Analyzer";
import { FeInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { Arr } from "../../sharedWithServer/utils/Arr";
import useDidChange from "../appWide/customHooks/useDidChange";

type SectionsToDelete = FeInfo[];
type Props = {
  sectionName: SectionName<"userList">;
  mainAnalyzer: Analyzer;
  setMainAnalyzer: React.Dispatch<React.SetStateAction<Analyzer>>;
};
export default function useLmAnalyzer({
  sectionName,
  mainAnalyzer,
  setMainAnalyzer,
}: Props) {
  const lmContext = usePropertyAnalyzer({
    prePopulatedState: mainAnalyzer,
  });

  const { replaceSavedSectionArr } = useSectionArrQueries(sectionName);

  const { analyzer: lmAnalyzer, setAnalyzer: setLmAnalyzer } = lmContext;
  const [sectionsToDelete, setSectionsToDelete] = React.useState(
    [] as SectionsToDelete
  );
  const disableUndo = sectionsToDelete.length === 0;

  let nextLmAnalyzer = lmAnalyzer.eraseSectionsAndSolve(sectionsToDelete);

  const mainUserLists = mainAnalyzer.dbEntryArr(sectionName);
  const nextUserLists = nextLmAnalyzer.dbEntryArr(sectionName);
  const didChange = useDidChange(mainUserLists, nextUserLists);

  const handlers = {
    handleRemoveSection(feInfo: FeInfo) {
      setSectionsToDelete([...sectionsToDelete, feInfo]);
    },
    undoEraseSection() {
      setSectionsToDelete(Arr.removeLastClone(sectionsToDelete));
    },
    async saveUserLists() {
      unstable_batchedUpdates(() => {
        setLmAnalyzer(nextLmAnalyzer);
        setMainAnalyzer(nextLmAnalyzer);
        setSectionsToDelete([]);
      });
      replaceSavedSectionArr();
    },
    discardChanges() {
      unstable_batchedUpdates(() => {
        setLmAnalyzer(mainAnalyzer);
        setSectionsToDelete([]);
      });
    },
  };

  return {
    ...lmContext,
    ...handlers,
    disableUndo,
    didChange,
    analyzer: nextLmAnalyzer,
  };
}
