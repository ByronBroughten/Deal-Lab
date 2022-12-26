import { isEqual } from "lodash";
import React from "react";
import styled from "styled-components";
import { apiQueries } from "../../modules/apiQueriesClient";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListUserVarbs } from "../appWide/VarbLists/VarbListUserVarbs";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

function useSaveUserVarbs(): {
  saveChanges: () => void;
  discardChanges: () => void;
  areSaved: boolean;
} {
  const varbEditor = useSetterSectionOnlyOne("userVarbEditor");
  const feUser = useSetterSectionOnlyOne("feUser");
  const getEditorPacks = () => {
    return varbEditor.packMaker.makeChildPackArr("userVarbListMain");
  };
  const getStoredPacks = () => {
    return feUser.packMaker.makeChildPackArr("userVarbListMain");
  };
  const saveChanges = () => {
    const arrQuerier = new SectionArrQuerier({ apiQueries });
    const listPacks = getEditorPacks();
    feUser.tryAndRevertIfFail(async () => {
      feUser.replaceChildArrs({
        userVarbListMain: listPacks,
      });
      await arrQuerier.replace({ userVarbListMain: listPacks });
    });
  };
  const discardChanges = () => {
    const listPacks = getStoredPacks();
    varbEditor.replaceChildArrs({
      userVarbListMain: listPacks,
    });
  };
  const [areSaved, setAreSaved] = React.useState(true);
  React.useEffect(() => {
    let doIt = true;
    setTimeout(() => {
      if (doIt) {
        const workingPackList = getEditorPacks();
        const savedPackList = getStoredPacks();
        const nextAreSaved = isEqual(workingPackList, savedPackList);
        setAreSaved(nextAreSaved);
      }
    }, 700);
  });
  return {
    saveChanges,
    discardChanges,
    areSaved,
  };
}

export function UserVarbEditor() {
  const userVarbEditor = useSetterSectionOnlyOne("userVarbEditor");
  const { saveChanges, discardChanges, areSaved } = useSaveUserVarbs();
  usePrompt(
    "Your changes have not been applied. Are you sure you want to leave? (Your changes will not be lost)",
    !areSaved
  );
  return (
    <Styled className="UserListMainSection-root">
      <UserEditorTitleRow
        {...{
          titleText: "Variables",
          saveChanges,
          discardChanges,
          areSaved,
        }}
      />
      <MainSectionBody>
        <ListGroupLists
          {...{
            feIds: userVarbEditor.childFeIds("userVarbListMain"),
            addList: () => userVarbEditor.addChild("userVarbListMain"),
            makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(OuterMainSection)``;
