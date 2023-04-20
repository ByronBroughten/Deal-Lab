import React from "react";
import { AiOutlineInfoCircle, AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { useMainSectionActor } from "../../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { LabeledIconBtn } from "../../../LabeledIconBtn";
import { ActionLoadBtn } from "./ActionLoadBtn";
import {
  ActionBtnName,
  ActionMenuLists,
  alwaysActions,
  isNotSavedActions,
  isSavedActions,
} from "./ActionMenuTypes";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  onLoad?: () => void;
  sectionName: SN;
  feId: string;
};

export function useDefaultActionLists(): ActionMenuLists {
  return {
    isNotSavedArr: isNotSavedActions,
    isSavedArr: isSavedActions,
    alwaysArr: alwaysActions,
  };
}

export function useActionMenuBtns<
  SN extends SectionNameByType<"hasIndexStore">
>({ onLoad, ...feInfo }: Props<SN>) {
  const mainSection = useMainSectionActor(feInfo);
  const { isGuest } = mainSection.feStore;

  const actionMenuBtns: Record<ActionBtnName, React.ReactElement> = {
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
          label={"Save to components"}
          icon={<AiOutlineSave size="25" />}
          onClick={() => mainSection.saveSelfNew()}
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
          label="Add to components"
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
          onClick={() => mainSection.makeSelfACopy()}
        />
      );
    },
    // get makeSelfACopyAndSave() {
    //   return (
    //     <LabeledIconBtn
    //       key="makeSelfACopyAndSave"
    //       label="Copy and save"
    //       icon={
    //         <span style={{ display: "flex" }}>
    //           <BiCopy size="23" />
    //           <AiOutlineSave size="21" />
    //         </span>
    //       }
    //       onClick={() => mainSection.makeSelfACopyAndSave()}
    //       disabled={isGuest}
    //     />
    //   );
    // },
    get load() {
      return (
        <ActionLoadBtn
          {...{
            feInfo,
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
          label="Reset default"
          icon={<BiReset size="26" />}
          onClick={() => mainSection.replaceWithDefault()}
        />
      );
    },
  } as const;
  return actionMenuBtns;
}
