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
  const { isGuest } = section.feUser;
  const toastWarn = () => toastLoginNotice("save");
  return (
    <DropdownBtnWrapper
      {...{
        renderDropdownBtn: (toggleDropdown) => (
          <StyledActionBtn
            middle={"Save as"}
            left={<AiOutlineSave size={23} />}
            onClick={isGuest ? toastWarn : toggleDropdown}
            className="ActionMenuButtons-signInToSave ActionMenuButtons-warn"
            style={{
              color: isGuest
                ? nativeTheme.notice.dark
                : nativeTheme.primary.main,
            }}
          />
        ),
        renderDropdownContent: () => (
          <View>
            <MaterialStringEditor
              {...{
                ...feVarbInfo,
                label: "Title",
                handleReturn: () => {
                  section.saveAsNew();
                  return "handled";
                },
              }}
            />
            <SectionBtn
              {...{ middle: "Save", onClick: () => section.saveAsNew() }}
            />
          </View>
        ),
      }}
    />
  );
}
