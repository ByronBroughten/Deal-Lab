import React from "react";
import { AiOutlineInfoCircle, AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { useFeUser } from "../../../../../modules/sectionActorHooks/useFeUser";
import { useMainSectionActor } from "../../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { LabeledIconBtn } from "../../../LabeledIconBtn";
import { ActionBtnLoad } from "./ActionBtnLoad";
import {
  ActionMenuLists,
  AllActions,
  alwaysActions,
  guestIsNotSavedActions,
  guestIsSavedActions,
  isNotSavedActions,
  isSavedActions,
} from "./ActionMenuTypes";

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

export function useActionMenuBtns<
  SN extends SectionNameByType<"hasIndexStore">
>({ loadWhat, onLoad, ...feInfo }: Props<SN>) {
  const mainSection = useMainSectionActor(feInfo);
  const { isGuest } = mainSection.feUser;

  const actionMenuBtns: Record<AllActions, React.ReactNode> = {
    get signInToSave() {
      return (
        <LabeledIconBtn
          key="signInToSave"
          label={"Sign in to Save"}
          disabled={true}
          icon={<AiOutlineInfoCircle size={25} />}
          onClick={() => {}}
          className="ActionMenuButtons-signInToSave"
        />
      );
    },
    get save() {
      return (
        <LabeledIconBtn
          key="save"
          label={"Save"}
          icon={<AiOutlineSave size="25" />}
          onClick={() => mainSection.saveNew()}
          disabled={isGuest}
        />
      );
    },
    get saveUpdates() {
      return (
        <LabeledIconBtn
          key="saveUpdates"
          label="Save changes"
          icon={<MdOutlineSystemUpdateAlt size="25" />}
          onClick={() => mainSection.saveUpdates()}
          disabled={isGuest}
        />
      );
    },
    get saveAsNew() {
      return (
        <LabeledIconBtn
          key="saveAsNew"
          label="Save as new"
          icon={<AiOutlineSave size="25" />}
          onClick={() => mainSection.saveAsNew()}
          disabled={isGuest}
        />
      );
    },
    get copy() {
      return (
        <LabeledIconBtn
          key="copy"
          label="Make a copy"
          icon={<BiCopy size="28" />}
          onClick={() => mainSection.makeACopy()}
        />
      );
    },
    get copyAndSave() {
      return (
        <LabeledIconBtn
          key="copyAndSave"
          label="Copy and save"
          icon={
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
        <ActionBtnLoad
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
        <ActionBtnLoad
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
        <LabeledIconBtn
          key="createNew"
          label="Create new"
          icon={<BiReset size="26" />}
          onClick={() => mainSection.replaceWithDefault()}
        />
      );
    },
  } as const;
  return actionMenuBtns;
}
