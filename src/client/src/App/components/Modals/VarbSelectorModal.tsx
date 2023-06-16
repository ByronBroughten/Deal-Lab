import { SxProps } from "@mui/material";
import { DealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { nativeTheme } from "../../theme/nativeTheme";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { useGoToPage } from "../customHooks/useGoToPage";
import { MuiRow } from "../general/MuiRow";
import { icons } from "../Icons";
import { MaterialStringEditor } from "../inputs/MaterialStringEditor";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import { VarbSelectorByDealMode } from "../inputs/NumObjEditor/VarbSelectorByDealMode";
import { ModalSection } from "./ModalSection";
import {
  useVarbSelectModal,
  VarbSelectModalOptions,
  VarbSelectModalState,
} from "./VarbSelectModalProvider";

export interface VarbSelectModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  dealMode: DealMode<"plusMixed">;
  onVarbSelect: OnVarbSelect;
}

function getVarbSelectModalOptions(
  modalState: VarbSelectModalState
): VarbSelectModalOptions {
  return {
    onVarbSelect: () => {},
    dealMode: "mixed",
    timeSet: 0,
    ...modalState,
  };
}

interface Props {
  modalWrapperProps?: { sx?: SxProps };
}
export function VarbSelectorModal(props: Props) {
  const goToVariables = useGoToPage("userVariables");
  const menu = useGetterSectionOnlyOne("variablesMenu");

  const { modalState, setModal } = useVarbSelectModal();
  const { timeSet, onVarbSelect, dealMode } =
    getVarbSelectModalOptions(modalState);
  return (
    <ModalSection
      {...{
        ...props,
        title: "Variable Select",
        show: Boolean(modalState),
        closeModal: () => {
          if (timeSet && timeSet < timeS.now() - 200) {
            setModal(null);
          }
        },
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
