import isEqual from "fast-deep-equal";
import React from "react";
import { apiQueries } from "../../modules/apiQueriesClient";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { SnFeUserChildNames } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { SectionPackArrs } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";

export function useSaveEditorToDb<
  SN extends SectionName,
  CN extends SnFeUserChildNames<SN>
>(
  sectionName: SN,
  childNames: CN[]
): {
  saveChanges: () => void;
  discardChanges: () => void;
  areSaved: boolean;
} {
  const editor = useSetterSectionOnlyOne(sectionName);
  const feUser = useSetterSectionOnlyOne("feUser");
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
    feUser.tryAndRevertIfFail(async () => {
      feUser.replaceChildArrs(listPacks);
      await arrQuerier.replace(listPacks);
    });
  };
  const discardChanges = () => {
    const listPacks = getStoredPacks();
    editor.replaceChildArrs(listPacks);
  };
  const [areSaved, setAreSaved] = React.useState(true);
  React.useEffect(() => {
    let doIt = true;
    setTimeout(() => {
      if (doIt) {
        const workingPacks = getEditorPacks();
        const savedPacks = getStoredPacks();
        const areSavedNext = isEqual(workingPacks, savedPacks);
        setAreSaved(areSavedNext);
      }
    }, 700);
  });
  return {
    saveChanges,
    discardChanges,
    areSaved,
  };
}
