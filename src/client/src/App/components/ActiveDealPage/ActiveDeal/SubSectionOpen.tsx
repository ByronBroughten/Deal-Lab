import { nativeTheme } from "../../../theme/nativeTheme";
import { MainSection } from "../../appWide/GeneralSection/MainSection";

interface Props {
  children: React.ReactNode;
}
export function SubSectionOpen({ children }: Props) {
  return (
    <MainSection
      sx={{
        width: "100%",
        maxWidth: 800,
        minHeight: 300,
        paddingTop: nativeTheme.s5,
        paddingLeft: nativeTheme.s6,
        paddingRight: nativeTheme.s6,
      }}
    >
      {children}
    </MainSection>
  );
}
