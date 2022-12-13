import { FaList } from "react-icons/fa";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { FeInfoByType } from "../../sharedWithServer/SectionsMeta/Info";
import { DropdownList } from "./DropdownList";
import { RowIndexRows } from "./RowIndexRows";

type Props = {
  feInfo: FeInfoByType<"hasIndexStore">;
  pluralName: string;
  disabled: boolean;
  className?: string;
  dropTop?: boolean;
};

export function DisplayNameSectionList({
  feInfo,
  dropTop = false,
  className,
  pluralName,
}: Props) {
  const feUser = useFeUser();
  return (
    <DropdownList
      {...{
        className: "DisplayNameSectionList-root " + className ?? "",
        title: `Load`,
        dropTop,
        icon: <FaList className="DisplayNameSectionList-listIcon" />,
      }}
    >
      <RowIndexRows
        {...{
          feInfo,
          noEntriesMessage: "None saved",
          ...(feUser.isGuest && {
            noAccessMessage: `Sign in to access saved ${pluralName}`,
          }),
        }}
      />
    </DropdownList>
  );
}
