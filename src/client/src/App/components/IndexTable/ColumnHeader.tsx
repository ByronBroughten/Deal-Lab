import { IoMdArrowDropdown } from "react-icons/io";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../modules/customHooks/useToggleView";
import SimpleMuiMenu, { SimpleMuiMenuItem } from "../appWide/SimpleMuiMenu";
import PlainIconBtn from "../general/PlainIconBtn";

type Props = {
  displayName: string;

  sortRowsAZ: () => void;
  sortRowsZA: () => void;
  removeColumn?: () => void;
};
export default function ColumnHeader({
  displayName,
  // colMenuIsOpen,
  // toggleColMenu,
  // closeColMenu,

  sortRowsAZ,
  sortRowsZA,
  removeColumn,
}: Props) {
  const { colMenuIsOpen, toggleColMenu, closeColMenu } = useToggleView({
    initValue: false,
    viewWhat: "colMenu",
  });
  const colMenuRef = useOnOutsideClickRef(closeColMenu, "th");

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
      <div className="IndexTable-thContent">
        {displayName}
        <div ref={colMenuRef}>
          <PlainIconBtn onClick={toggleColMenu}>
            <IoMdArrowDropdown className="IndexTable-columnArrow" />
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
