import { AiOutlineSave } from "react-icons/ai";
import { View } from "react-native";
import { useMainSectionActor } from "../../../../../modules/sectionActorHooks/useMainSectionActor";
import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { DropdownBtnWrapper } from "../../../../general/DropdownBtnWrapper";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { SectionBtn } from "../../../SectionBtn";
import { toastLoginNotice } from "../../../toast";
import { StyledActionBtn } from "./ActionBtns.tsx/StyledActionBtn";

interface Props extends FeInfoByType<"hasIndexStore"> {}
export function ActionSaveAsNewBtn(feInfo: Props) {
  const section = useMainSectionActor(feInfo);
  const { feVarbInfo } = section.get.varb("displayName");
  const { isGuest } = section.feStore;
  const toastWarn = () => toastLoginNotice("save");
  return (
    <DropdownBtnWrapper
      {...{
        renderDropdownBtn: (toggleDropdown, dropdownIsOpen) => (
          <StyledActionBtn
            middle={"Save as"}
            left={<AiOutlineSave size={23} />}
            onClick={isGuest ? toastWarn : toggleDropdown}
            className="ActionMenuButtons-signInToSave ActionMenuButtons-warn"
            isActive={dropdownIsOpen}
            isDisabled={isGuest}
          />
        ),
        renderDropdownContent: () => (
          <View
            style={{
              backgroundColor: nativeTheme.light,
              borderRadius: nativeTheme.br0,
            }}
          >
            <MaterialStringEditor
              {...{
                ...feVarbInfo,
                style: { minWidth: 130 },
                label: "Title",
                handleReturn: () => {
                  section.saveAsNew();
                  return "handled";
                },
              }}
            />
            <SectionBtn
              {...{
                sx: {
                  borderTopWidth: 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
                middle: "Save New",
                onClick: () => section.saveAsNew(),
              }}
            />
          </View>
        ),
      }}
    />
  );
}
