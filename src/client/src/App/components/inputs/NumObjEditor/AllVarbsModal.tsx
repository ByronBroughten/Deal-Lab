import styled from "styled-components";
import { SetEditorState } from "../../../modules/draftjs/draftUtils";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme from "../../../theme/Theme";
import { ModalSection } from "../../appWide/ModalSection";
import { VarbSelectorAllCollections } from "./VarbSelectorAllCollections";

interface Props {
  focalInfo: FeSectionInfo;
  setEditorState: SetEditorState;
  closeAllVarbs: () => void;
  allVarbsIsOpen: boolean;
}
export function AllVarbsModal({
  focalInfo,
  setEditorState,
  closeAllVarbs,
  allVarbsIsOpen,
}: Props) {
  return (
    <Styled
      {...{
        className: "NumObjVarbSelector-allVarbsModal",
        title: "Variable Select",
        closeModal: closeAllVarbs,
        show: allVarbsIsOpen,
      }}
    >
      <VarbSelectorAllCollections
        {...{
          focalInfo,
          setEditorState,
        }}
      />
    </Styled>
  );
}

const Styled = styled(ModalSection)`
  .ModalSection-mainSection {
    background-color: ${theme["gray-300"]};
  }
  .ModalSection-sectionTitle {
    color: ${theme.primary.dark};
  }
`;
