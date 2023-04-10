import { BsCloudArrowDown } from "react-icons/bs";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { DropdownBtnWrapper } from "../../../../general/DropdownBtnWrapper";
import { SectionIndexRows } from "../../../SectionIndexRows";
import { StyledActionBtn } from "./ActionBtns.tsx/StyledActionBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  loadWhat: string;
  feInfo: FeSectionInfo<SN>;
  loadMode: "load" | "loadAndCopy";
  className?: string;
  onLoad?: () => void;
};
export function ActionLoadBtn<SN extends SectionNameByType<"hasIndexStore">>({
  loadWhat,
  feInfo,
  loadMode,
  className,
  onLoad,
}: Props<SN>) {
  return (
    <DropdownBtnWrapper
      {...{
        renderDropdownBtn: (toggleDropdown, dropdownIsOpen) => (
          <StyledActionBtn
            key="load"
            middle="Load component"
            left={<BsCloudArrowDown size={26} />}
            onClick={toggleDropdown}
            className={`ActionLoadBtn-root ${className ?? ""}`}
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
              loadMode,
            }}
          />
        ),
      }}
    />
  );
}
