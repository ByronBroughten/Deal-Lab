import { DealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { ModalSection } from "../appWide/ModalSection";
import { useGoToPage } from "../customHooks/useGoToPage";
import { icons } from "../Icons";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import { VarbSelectorByDealMode } from "../inputs/NumObjEditor/VarbSelectorByDealMode";
import { MuiRow } from "./MuiRow";

export interface VarbSelectModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  dealMode: DealMode<"plusMixed">;
  onVarbSelect: OnVarbSelect;
}

export function VarbSelectorModal({
  modalIsOpen,
  closeModal,
  dealMode,
  onVarbSelect,
}: VarbSelectModalProps) {
  const goToVariables = useGoToPage("userVariables");
  const menu = useGetterSectionOnlyOne("variablesMenu");
  return (
    <ModalSection
      {...{
        title: "Variable Select",
        show: modalIsOpen,
        closeModal,
      }}
    >
      <MuiRow sx={{ justifyContent: "space-between" }}>
        <MaterialStringEditor
          {...{
            ...menu.varbInfo("nameFilter"),
            placeholder: "Filter",
            sx: {
              "& .DraftEditor-root": {
                minWidth: 120,
              },
            },
          }}
        />
        <StyledActionBtn
          sx={{
            border: `solid 1px ${nativeTheme["gray-300"]}`,
            ml: nativeTheme.s35,
            color: nativeTheme.darkBlue.dark,
            "&:hover": {
              color: nativeTheme.light,
              backgroundColor: nativeTheme.darkBlue.dark,
            },
          }}
          left={icons.variable({ size: 21 })}
          middle={"Your Variables"}
          onClick={goToVariables}
        />
      </MuiRow>
      <VarbSelectorByDealMode
        {...{
          sx: { mt: nativeTheme.s25 },
          dealMode,
          nameFilter: menu.valueNext("nameFilter"),
          onVarbSelect,
        }}
      />
    </ModalSection>
  );
}
