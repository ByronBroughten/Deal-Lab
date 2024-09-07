import useOnOutsideClickRef from "../../../../../modules/customHooks/useOnOutsideClickRef";
import { useToggleView } from "../../../../../modules/customHooks/useToggleView";
import { Obj } from "../../../../../sharedWithServer/utils/Obj";
import SimpleMuiMenu, {
  SimpleMuiMenuItem,
} from "../../../appWide/SimpleMuiMenu";

interface Props extends MenuOptionProps {
  displayName: string;
}
export default function ColumnHeader({ displayName, ...menuFns }: Props) {
  const { colMenuIsOpen, closeColMenu } = useToggleView("colMenu", false);
  const colMenuRef = useOnOutsideClickRef(closeColMenu, "th");
  const menuItems = makeMenuItems(menuFns);
  return (
    <th className="ColumnHeader-root">
      <div className="CompareTable-thContent">
        {displayName}
        <div ref={colMenuRef}>
          {/* {menuItems.length > 0 && (
            <PlainIconBtn onClick={toggleColMenu}>
              <IoMdArrowDropdown className="CompareTable-columnArrow" />
            </PlainIconBtn>
          )} */}
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

const menuOptionDisplayValues = {
  sortRowsAZ: "Sort A-Z",
  sortRowsZA: "Sort Z-A",
  removeColumn: "Remove column",
} as const;
const menuItemNames = Obj.keys(menuOptionDisplayValues);
type MenuItemName = (typeof menuItemNames)[number];
type MenuOptionProps = {
  [K in MenuItemName]?: () => void;
};

function makeMenuItems(props: MenuOptionProps) {
  const menuItems: SimpleMuiMenuItem[] = [];
  for (const optionName of Obj.keys(menuOptionDisplayValues)) {
    const onClick = props[optionName];
    if (onClick)
      menuItems.push({
        onClick,
        displayValue: menuOptionDisplayValues[optionName],
      });
  }
  return menuItems;
}
