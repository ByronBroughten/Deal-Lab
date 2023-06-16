import { SxProps } from "@mui/material";
import { AiOutlineSave } from "react-icons/ai";
import { View } from "react-native";
import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterFeStore } from "../../../../../sharedWithServer/stateClassHooks/useFeStore";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { DropdownBtnWrapper } from "../../../../general/DropdownBtnWrapper";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { useConfirmationModal } from "../../../../Modals/ConfirmationDialogueProvider";
import { SectionBtn } from "../../../SectionBtn";
import { StyledActionBtn } from "../StyledActionBtn";

interface Props extends FeInfoByType<"hasIndexStore"> {
  btnProps?: { sx?: SxProps };
}
export function ActionSaveAsNewBtn({ btnProps, ...feInfo }: Props) {
  const section = useGetterSection(feInfo);
  const feStore = useGetterFeStore();
  const displayNameVarb = section.varb("displayName");
  const howManyWithDisplayName = feStore.howManyWithDisplayName(
    section.mainStoreName,
    section.valueNext("displayName").mainText
  );

  const saveAndOverwrite = useAction("saveAndOverwriteToStore");
  const { setModal } = useConfirmationModal();
  const doSave = () => saveAndOverwrite({ feInfo });

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
        renderDropdownContent: () => (
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
                  "&:hover": {
                    borderTopWidth: 0,
                    backgroundColor: nativeTheme.darkBlue.main,
                  },
                },
                middle: "Save",
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
                            description:
                              "Would you like to overwrite ALL of them?",
                          };
                    setModal({
                      variant: "danger",
                      catchOnCancel: true,
                      ...options,
                    })
                      .then(doSave)
                      .catch();
                  }
                },
              }}
            />
          </View>
        ),
      }}
    />
  );
}
