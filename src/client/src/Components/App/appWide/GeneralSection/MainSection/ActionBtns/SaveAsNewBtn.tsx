import { SxProps } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { AiOutlineSave } from "react-icons/ai";
import { View } from "react-native";
import { useToggleView } from "../../../../../../modules/customHooks/useToggleView";
import { FeInfoByType } from "../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { useAction } from "../../../../../../stateHooks/useAction";
import { useGetterFeStore } from "../../../../../../stateHooks/useFeStore";
import { useGetterSection } from "../../../../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { DropdownBtnWrapper } from "../../../../../general/DropdownBtnWrapper";
import { icon } from "../../../../Icons";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { useConfirmationModal } from "../../../../Modals/ConfirmationModalProvider";
import { SectionBtn } from "../../../SectionBtn";
import { StyledActionBtn } from "../StyledActionBtn";

interface Props extends FeInfoByType<"hasIndexStore"> {
  btnProps?: { sx?: SxProps };
}

export function ActionSaveAsNewBtn({ btnProps, ...feInfo }: Props) {
  return (
    <DropdownBtnWrapper
      {...{
        renderDropdownBtn: (toggleDropdown, dropdownIsOpen) => (
          <StyledActionBtn
            middle={"Save as"}
            left={<AiOutlineSave size={23} />}
            onClick={toggleDropdown}
            isActive={dropdownIsOpen}
            {...btnProps}
          />
        ),
        renderDropdownContent: () => <Dropdown {...feInfo} />,
      }}
    />
  );
}

function Dropdown(feInfo: FeInfoByType<"hasIndexStore">) {
  const section = useGetterSection(feInfo);
  const feStore = useGetterFeStore();
  const displayNameVarb = section.varb("displayName");
  const howManyWithDisplayName = feStore.howManyWithDisplayName(
    section.mainStoreName,
    section.valueNext("displayName").mainText
  );

  const saveAndOverwrite = useAction("saveAndOverwriteToStore");
  const { setModal } = useConfirmationModal();

  const { savedCheckmarkIsOpen, openSavedCheckmark } =
    useToggleView("savedCheckmark");

  const doSave = () =>
    unstable_batchedUpdates(() => {
      openSavedCheckmark();
      saveAndOverwrite({ feInfo });
    });

  return (
    <View
      style={{
        position: "relative",
        left: 8,
        backgroundColor: nativeTheme.light,
        borderRadius: nativeTheme.br0,
      }}
    >
      <MaterialStringEditor
        {...{
          ...displayNameVarb.feVarbInfo,
          sx: { "& .DraftEditor-root": { minWidth: 130 } },
          label: "Title",
        }}
      />
      <SectionBtn
        {...{
          sx: {
            borderTopWidth: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: nativeTheme.darkBlue.light,
            color: nativeTheme.dark,
            fontSize: 18,
            "&:hover": {
              borderTopWidth: 0,
              backgroundColor: nativeTheme.darkBlue.main,
            },
          },
          middle: savedCheckmarkIsOpen ? icon("saved", { size: 30 }) : "Save",
          onClick: () => {
            if (howManyWithDisplayName === 0) {
              doSave();
            } else {
              const options =
                howManyWithDisplayName === 1
                  ? {
                      title: "An entry with that title is already saved",
                      description: "Would you like to overwrite it?",
                    }
                  : {
                      title:
                        "Multiple entries with that title are already saved",
                      description: "Would you like to overwrite ALL of them?",
                    };
              setModal({ ...options, handleSubmit: doSave });
            }
          },
        }}
      />
    </View>
  );
}
