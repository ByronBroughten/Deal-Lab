import { AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdDelete, MdOutlineSystemUpdateAlt } from "react-icons/md";
import styled from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../theme/Theme";
import { DropdownList } from "../../DropdownList";
import { LabeledIconBtn } from "../../LabeledIconBtn";
import {
  ActionMenuProps,
  AllActions,
  alwaysActions,
  isNotSavedActions,
  isSavedActions,
} from "./StoreSectionActionMenu/ActionMenuTypes";

interface Props<SN extends SectionName<"hasIndexStore">>
  extends ActionMenuProps {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
}
export function StoreSectionActionMenu<
  SN extends SectionName<"hasIndexStore">
>({
  dropTop,
  className,
  isNotSavedArr = isNotSavedActions,
  isSavedArr = isSavedActions,
  alwaysArr = alwaysActions,
  ...feInfo
}: Props<SN>) {
  const mainSection = useMainSectionActor(feInfo);
  const authStatus = useAuthStatus();
  const isGuest = authStatus === "guest";

  const buttons: Record<AllActions, React.ReactNode> = {
    save: (
      <LabeledIconBtn
        label={isGuest ? "Sign in to Save" : "Save"}
        disabled={isGuest}
        icon={<AiOutlineSave size="25" />}
        onClick={() => mainSection.saveNew()}
      />
    ),
    saveUpdates: (
      <LabeledIconBtn
        label="Save updates"
        icon={<MdOutlineSystemUpdateAlt size="25" />}
        onClick={() => mainSection.saveUpdates()}
      />
    ),
    saveAsNew: (
      <LabeledIconBtn
        label="Save as new"
        icon={<AiOutlineSave size="25" />}
        onClick={() => mainSection.saveAsNew()}
      />
    ),
    copy: (
      <LabeledIconBtn
        label="Make a copy"
        icon={<BiCopy size="28" />}
        onClick={() => mainSection.makeACopy()}
      />
    ),
    copyAndSave: (
      <LabeledIconBtn
        label="Copy and save"
        icon={
          <span style={{ display: "flex" }}>
            <BiCopy size="23" />
            <AiOutlineSave size="21" />
          </span>
        }
        onClick={() => mainSection.copyAndSave()}
      />
    ),
    delete: (
      <LabeledIconBtn
        label="Delete from saved"
        icon={<MdDelete size="24" />}
        onClick={() => mainSection.deleteSelf()}
      />
    ),
    createNew: (
      <LabeledIconBtn
        label="Create new"
        icon={<BiReset size="26" />}
        onClick={() => mainSection.replaceWithDefault()}
      />
    ),
  } as const;

  return (
    <Styled
      {...{
        className: `StoreSectionActionMenu-root ${className ?? ""}`,
        title: `Actions`,
        dropTop,
      }}
    >
      {!mainSection.isSaved &&
        isNotSavedArr.map((actionName) => buttons[actionName])}
      {mainSection.isSaved &&
        isSavedArr.map((actionName) => buttons[actionName])}
      {alwaysArr.map((actionName) => buttons[actionName])}
    </Styled>
  );
}

const Styled = styled(DropdownList)`
  .LabeledIconBtn-root {
    border-top: 1px solid ${theme["gray-500"]};
  }
  position: relative;
  z-index: 5;
`;
