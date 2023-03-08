import isEqual from "fast-deep-equal";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { apiQueries } from "../../modules/apiQueriesClient";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { SnFeUserChildNames } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSections } from "../../sharedWithServer/stateClassHooks/useSetterSections";
import { SectionPackArrs } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SetterSections } from "../../sharedWithServer/StateSetters/SetterSections";

export function useSaveEditorToDb<
  SN extends SectionName,
  CN extends SnFeUserChildNames<SN>
>(
  sectionName: SN,
  childNames: CN[],
  onSave?: (setterSections: SetterSections) => void
): {
  saveChanges: () => void;
  discardChanges: () => void;
  areSaved: boolean;
} {
  const setterSections = useSetterSections();
  const editor = setterSections.oneAndOnly(sectionName);
  const feUser = setterSections.oneAndOnly("feUser");
  const getEditorPacks = (): SectionPackArrs<"feUser", CN> => {
    return editor.packMaker.makeChildPackArrs(childNames) as SectionPackArrs<
      "feUser",
      CN
    >;
  };
  const getStoredPacks = (): SectionPackArrs<SN, CN> => {
    return feUser.packMaker.makeChildPackArrs(childNames) as SectionPackArrs<
      SN,
      CN
    >;
  };
  const saveChanges = () => {
    const arrQuerier = new SectionArrQuerier({ apiQueries });
    const listPacks = getEditorPacks();
    unstable_batchedUpdates(() => {
      feUser.tryAndRevertIfFail(async () => {
        feUser.replaceChildArrs(listPacks);
        await arrQuerier.replace(listPacks);
        onSave && onSave(setterSections);
      });
    });
  };
  const discardChanges = () => {
    const listPacks = getStoredPacks();
    editor.replaceChildArrs(listPacks);
  };
  const [areSaved, setAreSaved] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      if (true) {
        const workingPacks = getEditorPacks();
        const savedPacks = getStoredPacks();
        const areSavedNext = isEqual(workingPacks, savedPacks);
        setAreSaved(areSavedNext);
      }
    }, 500);
  });

  return {
    saveChanges,
    discardChanges,
    areSaved,
  };
}
