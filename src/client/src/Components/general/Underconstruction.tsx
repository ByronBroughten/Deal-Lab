import { nativeTheme } from "../../theme/nativeTheme";
import { Column } from "./Column";
import { TextNext } from "./TextNext";

export function UnderConstruction() {
  return (
    <Column
      sx={{
        flex: 1,
        padding: nativeTheme.s5,
        justifyContent: "center",
      }}
    >
      <TextNext sx={{ fontSize: 30, color: nativeTheme.primary.main }}>
        Under Construction
      </TextNext>
    </Column>
  );
}
