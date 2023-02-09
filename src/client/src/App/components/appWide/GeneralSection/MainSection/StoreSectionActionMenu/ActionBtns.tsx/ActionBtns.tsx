import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { useFeUser } from "../../../../../../modules/sectionActorHooks/useFeUser";
import { useMainSectionActor } from "../../../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StyledIconBtn } from "../../../../StyledIconBtn";
import { toastNotice } from "../../../../toast";
import {
  ActionBtnName,
  ActionMenuLists,
  alwaysActions,
  guestIsNotSavedActions,
  guestIsSavedActions,
  isNotSavedActions,
  isSavedActions,
} from "../ActionMenuTypes";
import { ActionLoadBtn } from "./ActionLoadBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  loadWhat: string;
  onLoad?: () => void;
  sectionName: SN;
  feId: string;
};

export function useDefaultActionLists(): ActionMenuLists {
  const { isGuest } = useFeUser();
  return {
    isNotSavedArr: isGuest ? guestIsNotSavedActions : isNotSavedActions,
    isSavedArr: isGuest ? guestIsSavedActions : isSavedActions,
    alwaysArr: alwaysActions,
  };
}

export function useActionBtns<SN extends SectionNameByType<"hasIndexStore">>({
  loadWhat,
  onLoad,
  ...feInfo
}: Props<SN>) {
  const mainSection = useMainSectionActor(feInfo);
  const { isGuest } = mainSection.feUser;

  const actionMenuBtns: Record<ActionBtnName, React.ReactElement> = {
    get signInToSave() {
      return (
        <StyledIconBtn
          middle={"Save"}
          left={<AiOutlineSave size="25" />}
          onClick={() => toastNotice("To save you must login.")}
          className="ActionMenuButtons-signInToSave ActionMenuButtons-warn"
        />
      );
    },
    get save() {
      return (
        <StyledIconBtn
          middle={"Save"}
          left={<AiOutlineSave size="25" />}
          onClick={() => mainSection.saveNew()}
          disabled={isGuest}
        />
      );
    },
    get saveUpdates() {
      return (
        <StyledIconBtn
          middle="Save changes"
          left={<MdOutlineSystemUpdateAlt size="25" />}
          onClick={() => mainSection.saveUpdates()}
          disabled={isGuest}
        />
      );
    },
    get saveAsNew() {
      return (
        <StyledIconBtn
          middle="Save as new"
          left={<AiOutlineSave size="25" />}
          onClick={() => mainSection.saveAsNew()}
          disabled={isGuest}
        />
      );
    },
    get copy() {
      return (
        <StyledIconBtn
          middle="Make a copy"
          left={<BiCopy size="28" />}
          onClick={() => mainSection.makeACopy()}
        />
      );
    },
    get copyAndSave() {
      return (
        <StyledIconBtn
          middle="Copy and save"
          left={
            <span style={{ display: "flex" }}>
              <BiCopy size="23" />
              <AiOutlineSave size="21" />
            </span>
          }
          onClick={() => mainSection.copyAndSave()}
          disabled={isGuest}
        />
      );
    },
    get load() {
      return (
        <ActionLoadBtn
          {...{
            feInfo,
            loadWhat,
            loadMode: "load",
            onLoad,
          }}
        />
      );
    },
    get loadAndCopy() {
      return (
        <ActionLoadBtn
          {...{
            feInfo,
            loadWhat,
            loadMode: "loadAndCopy",
            onLoad,
          }}
        />
      );
    },
    get createNew() {
      return (
        <StyledIconBtn
          middle="Create new"
          left={<BiReset size="26" />}
          onClick={() => mainSection.replaceWithDefault()}
        />
      );
    },
  } as const;
  return actionMenuBtns;
}
