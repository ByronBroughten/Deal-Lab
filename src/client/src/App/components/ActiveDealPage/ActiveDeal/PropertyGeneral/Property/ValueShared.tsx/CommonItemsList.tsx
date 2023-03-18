import styled from "styled-components";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { CheckboxList } from "./CheckboxList";

export type AddWithDisplayName = (displayName: string) => void;

export type CommonItemsListProps = {
  className?: string;
  menuDisplayNames: readonly string[];
  itemDisplayNames?: readonly string[];
  onChange: AddWithDisplayName;
};
export function CommonItemsList({
  itemDisplayNames = [],
  menuDisplayNames,
  onChange,
  className,
}: CommonItemsListProps) {
  const unusedDisplayNames = menuDisplayNames.filter(
    (name) => !itemDisplayNames.includes(name)
  );
  return (
    <Styled className={`CommonItemsList-root ${className ?? ""}`}>
      <CheckboxList
        {...{
          className: "CommonItemsList-checkBoxList",
          checkboxProps: unusedDisplayNames.map((displayName) => ({
            checked: false,
            onChange: () => onChange(displayName),
            label: displayName,
            name: displayName,
          })),
        }}
      />
    </Styled>
  );
}
const Styled = styled.div`
  .CommonItemsList-checkBoxList {
    margin-top: ${nativeTheme.s2};
  }
`;
