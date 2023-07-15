import { BsCloudArrowDown } from "react-icons/bs";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { DropdownBtnWrapper } from "../../../../general/DropdownBtnWrapper";
import { componentProps } from "../../../../props/userComponentPropGroups";
import { SectionIndexRows } from "../../../SectionIndexRows";
import { StyledActionBtn } from "../StyledActionBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  onLoad?: () => void;
};
export function ActionLoadBtn<SN extends SectionNameByType<"hasIndexStore">>({
  feInfo,
  onLoad,
}: Props<SN>) {
  const { mainStoreName } = useGetterSection(feInfo);
  const { loadWhat } = componentProps[mainStoreName];
  return (
    <DropdownBtnWrapper
      {...{
        renderDropdownBtn: (toggleDropdown, dropdownIsOpen) => (
          <StyledActionBtn
            key="load"
            middle={`Load template`}
            left={<BsCloudArrowDown size={26} />}
            onClick={toggleDropdown}
            isActive={dropdownIsOpen}
          />
        ),
        renderDropdownContent: ({ closeDropdown }) => (
          <SectionIndexRows
            {...{
              feInfo,
              onClick: () => {
                closeDropdown();
                onLoad && onLoad();
              },
            }}
          />
        ),
      }}
    />
  );
}
