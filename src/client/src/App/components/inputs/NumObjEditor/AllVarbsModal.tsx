import { AiOutlineArrowRight } from "react-icons/ai";
import { View } from "react-native";
import styled from "styled-components";
import { SetEditorState } from "../../../modules/draftjs/draftUtils";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSectionOnlyOne } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../theme/Theme";
import { useGoToPage } from "../../appWide/customHooks/useGoToPage";
import { StyledActionBtn } from "../../appWide/GeneralSection/MainSection/StoreSectionActionMenu/ActionBtns.tsx/StyledActionBtn";
import { ModalSection } from "../../appWide/ModalSection";
import { MaterialStringEditor } from "../MaterialStringEditor";
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
  const goToVariables = useGoToPage("userVariables");
  const variablesMenu = useGetterSectionOnlyOne("variablesMenu");
  const nameFilter = variablesMenu.valueNext("nameFilter");
  return (
    <Styled
      {...{
        className: "NumObjVarbSelector-allVarbsModal",
        title: "Variable Select",
        closeModal: closeAllVarbs,
        show: allVarbsIsOpen,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MaterialStringEditor
          {...{
            ...variablesMenu.varbNext("nameFilter").feVarbInfo,
            placeholder: "Filter",
            style: { minWidth: 120 },
          }}
        />
        <StyledActionBtn
          className="AllVarbsModal-goToVariablesBtn"
          middle={"Variables"}
          right={
            <AiOutlineArrowRight
              className="AllVarbsModal-goToVariablesArrow"
              size={21}
            />
          }
          onClick={goToVariables}
        />
      </View>
      <VarbSelectorAllCollections
        {...{
          nameFilter,
          focalInfo,
          setEditorState,
        }}
      />
    </Styled>
  );
}

const Styled = styled(ModalSection)`
  .VarbSelectorAllCollections-root {
    margin-top: ${theme.s25};
  }
  .AllVarbsModal-goToVariablesArrow {
  }
  .AllVarbsModal-goToVariablesBtn {
    margin-left: ${theme.s35};
    color: ${theme.primary.dark};
    :hover {
      color: ${theme.light};
      background-color: ${theme.primary.dark};
    }
  }
  .ModalSection-mainSection {
    background-color: ${theme["gray-300"]};
  }
  .ModalSection-sectionTitle {
    color: ${theme.primary.dark};
  }
`;
