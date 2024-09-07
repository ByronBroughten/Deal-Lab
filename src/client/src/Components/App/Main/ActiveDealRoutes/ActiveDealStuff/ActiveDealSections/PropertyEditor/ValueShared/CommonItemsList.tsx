import { Box, SxProps } from "@mui/material";
import { nativeTheme } from "../../../../../../../../theme/nativeTheme";
import { CheckboxList } from "./CheckboxList";

export type AddWithDisplayName = (displayName: string) => void;

export type CommonItemsListProps = {
  className?: string;
  menuDisplayNames: readonly string[];
  itemDisplayNames?: readonly string[];
  onChange: AddWithDisplayName;
  sx?: SxProps;
};
export function CommonItemsList({
  itemDisplayNames = [],
  menuDisplayNames,
  onChange,
  className,
  sx,
}: CommonItemsListProps) {
  const unusedDisplayNames = menuDisplayNames.filter(
    (name) => !itemDisplayNames.includes(name)
  );
  return (
    <Box sx={sx} className={className}>
      <CheckboxList
        {...{
          sx: { marginTop: nativeTheme.s2 },
          checkboxProps: unusedDisplayNames.map((displayName) => ({
            checked: false,
            onChange: () => onChange(displayName),
            label: displayName,
            name: displayName,
          })),
        }}
      />
    </Box>
  );
}
