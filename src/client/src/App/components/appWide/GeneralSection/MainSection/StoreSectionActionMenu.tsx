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

const isNotSavedActions = ["save"] as const;
type IsNotSavedActions = typeof isNotSavedActions[number];

const isSavedActions = [
  "save updates",
  "save as new",
  "copy",
  "copy and save",
  "delete",
] as const;
type IsSavedActions = typeof isSavedActions[number];

const alwaysActions = ["create new"] as const;
type AlwaysActions = typeof alwaysActions[number];
type AllActions = IsNotSavedActions | IsSavedActions | AlwaysActions;

type Props<SN extends SectionName<"hasIndexStore">> = {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
  isNotSavedArr?: readonly IsNotSavedActions[];
  isSavedArr?: readonly IsSavedActions[];
  alwaysArr?: readonly AlwaysActions[];
};
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

  const buttons = {
    save: (
      <LabeledIconBtn
        label={isGuest ? "Sign in to Save" : "Save"}
        disabled={isGuest}
        icon={<AiOutlineSave size="25" />}
        onClick={() => mainSection.saveNew()}
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
      {!mainSection.isSaved && buttons["save"]}
      {mainSection.isSaved && (
        <>
          <LabeledIconBtn
            label="Save updates"
            icon={<MdOutlineSystemUpdateAlt size="25" />}
            onClick={() => mainSection.saveUpdates()}
          />
          <LabeledIconBtn
            label="Save as new"
            icon={<AiOutlineSave size="25" />}
            onClick={() => mainSection.saveAsNew()}
          />
          <LabeledIconBtn
            label="Make a copy"
            icon={<BiCopy size="28" />}
            onClick={() => mainSection.makeACopy()}
          />
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
          <LabeledIconBtn
            label="Delete from saved"
            icon={<MdDelete size="24" />}
            onClick={() => mainSection.deleteSelf()}
          />
        </>
      )}
      <LabeledIconBtn
        label="Create new"
        icon={<BiReset size="26" />}
        onClick={() => mainSection.replaceWithDefault()}
      />
    </Styled>
  );
}

// function SimpleStoreSectionActionMenu() {
//   return <Styled></Styled>;
// }

const Styled = styled(DropdownList)`
  .LabeledIconBtn-root {
    border-top: 1px solid ${theme["gray-500"]};
  }
  position: relative;
  z-index: 5;
`;
