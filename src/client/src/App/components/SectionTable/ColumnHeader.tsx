import { IoMdArrowDropdown } from "react-icons/io";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import SimpleMuiMenu, { SimpleMuiMenuItem } from "../appWide/SimpleMuiMenu";
import PlainIconBtn from "../general/PlainIconBtn";

type Props = {
  displayName: string;
  colMenuIsOpen: boolean;
  toggleColMenu: () => void;
  closeColMenu: () => void;

  sortRowsAZ: () => void;
  sortRowsZA: () => void;
  removeColumn?: () => void;
};
export default function ColumnHeader({
  displayName,
  colMenuIsOpen,
  toggleColMenu,
  closeColMenu,

  sortRowsAZ,
  sortRowsZA,
  removeColumn,
}: Props) {
  const colMenuRef = useOnOutsideClickRef(closeColMenu);
  const menuItems: SimpleMuiMenuItem[] = [
    {
      displayValue: "Sort A-Z",
      onClick: sortRowsAZ,
    },
    {
      displayValue: "Sort Z-A",
      onClick: sortRowsZA,
    },
  ];

  if (removeColumn)
    menuItems.push({
      displayValue: "Remove column",
      onClick: removeColumn,
    });

  return (
    <th>
      <div className="SectionTable-thContent">
        {displayName}
        <div ref={colMenuRef}>
          <PlainIconBtn onClick={toggleColMenu}>
            <IoMdArrowDropdown className="SectionTable-columnArrow" />
          </PlainIconBtn>
          {colMenuIsOpen && (
            <SimpleMuiMenu
              {...{
                closeMenu: closeColMenu,
                items: menuItems,
              }}
            />
          )}
        </div>
      </div>
    </th>
  );
}
