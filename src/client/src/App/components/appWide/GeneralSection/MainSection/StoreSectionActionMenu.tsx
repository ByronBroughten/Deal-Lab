import { AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdDelete, MdOutlineSystemUpdateAlt } from "react-icons/md";
import styled from "styled-components";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import { DropdownList } from "../../DropdownList";
import { LabeledIconBtn } from "../../LabeledIconBtn";

type Props<SN extends SectionName<"hasIndexStore">> = {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
};
export function StoreSectionActionMenu<
  SN extends SectionName<"hasIndexStore">
>({ dropTop, className, ...feInfo }: Props<SN>) {
  const mainSection = useMainSectionActor(feInfo);
  const authStatus = useAuthStatus();
  const isGuest = authStatus === "guest";
  return (
    <Styled
      {...{
        className: `StoreSectionActionMenu-root ${className ?? ""}`,
        title: `Actions`,
        dropTop,
      }}
    >
      {!mainSection.isSaved && (
        <LabeledIconBtn
          label={isGuest ? "Sign in to Save" : "Save"}
          disabled={isGuest}
          icon={<AiOutlineSave size="25" />}
          onClick={() => mainSection.saveNew()}
        />
      )}
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

const Styled = styled(DropdownList)`
  position: relative;
  z-index: 5;
`;
