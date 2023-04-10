import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { useMainSectionActor } from "../../../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useGetterFeStore } from "../../../../../../sharedWithServer/stateClassHooks/useFeStore";
import { toastNotice } from "../../../../toast";
import { ActionLoadBtn } from "../ActionLoadBtn";
import {
  ActionBtnName,
  ActionMenuLists,
  alwaysActions,
  guestIsNotSavedActions,
  guestIsSavedActions,
  isNotSavedActions,
  isSavedActions,
} from "../ActionMenuTypes";
import { StyledActionBtn } from "./StyledActionBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  loadWhat: string;
  onLoad?: () => void;
  sectionName: SN;
  feId: string;
};

export function useDefaultActionLists(): ActionMenuLists {
  const { isGuest } = useGetterFeStore();
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
  const { isGuest } = mainSection.feStore;

  const actionMenuBtns: Record<ActionBtnName, React.ReactElement> = {
    get signInToSave() {
      return (
        <StyledActionBtn
          middle={"Save to components"}
          left={<AiOutlineSave size={23} />}
          onClick={() => toastNotice("To save, please login.")}
          className="ActionMenuButtons-signInToSave ActionMenuButtons-warn"
        />
      );
    },
    get save() {
      return (
        <StyledActionBtn
          middle={"Save as component"}
          left={<AiOutlineSave size={23} />}
          onClick={() => mainSection.saveSelfNew()}
          disabled={isGuest}
        />
      );
    },
    get saveUpdates() {
      return (
        <StyledActionBtn
          middle="Save changes"
          left={<MdOutlineSystemUpdateAlt size={23} />}
          onClick={() => mainSection.saveUpdates()}
          disabled={isGuest}
        />
      );
    },
    get saveAsNew() {
      return (
        <StyledActionBtn
          middle="Save as new"
          left={<AiOutlineSave size={23} />}
          onClick={() => mainSection.saveAsNew()}
          disabled={isGuest}
        />
      );
    },
    get copy() {
      return (
        <StyledActionBtn
          middle="Make a copy"
          left={<BiCopy size={25} />}
          onClick={() => mainSection.makeSelfACopy()}
        />
      );
    },
    // get makeSelfACopyAndSave() {
    //   return (
    //     <StyledActionBtn
    //       middle="Copy and save"
    //       left={
    //         <span style={{ display: "flex" }}>
    //           <BiCopy size={21} />
    //           <AiOutlineSave size={19} />
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
        <StyledActionBtn
          middle="Reset default"
          left={<BiReset size={23} />}
          onClick={() => mainSection.replaceWithDefault()}
        />
      );
    },
  } as const;
  return actionMenuBtns;
}
