import { Box } from "@mui/material";
import styled from "styled-components";
import { FeSectionInfo } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionNameByType } from "../../../../../../../../sharedWithServer/stateSchemas/SectionNameByType";
import { nativeTheme } from "../../../../../../../../theme/nativeTheme";
import { MuiRow } from "../../../../../../../general/MuiRow";
import { FormSection } from "../../../../../../appWide/FormSection";
import { VarbListGenericMenuType } from "../../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListMenuDual } from "../../../../../../appWide/ListGroup/ListGroupShared/VarbListMenuDual";
import { ListRouteName } from "../../../../../../UserListEditorPage/UserComponentClosed";
import { AddWithDisplayName, CommonItemsList } from "./CommonItemsList";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  onChange: AddWithDisplayName;
  className?: string;
  menuType: VarbListGenericMenuType;
  menuDisplayNames?: readonly string[];
  itemDisplayNames?: readonly string[];
  table: React.ReactNode;
  routeBtnProps?: {
    title: string;
    routeName: ListRouteName;
  };
}

export function ValueListGeneral<
  SN extends SectionNameByType<"varbListAllowed">
>({ className, menuType, table, menuDisplayNames, ...rest }: Props<SN>) {
  return (
    <Styled
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flex: 1,
      }}
      className={`ValueListGeneral-root ${className ?? ""}`}
    >
      <MuiRow sx={{ width: "100%", justifyContent: "flex-start" }}>
        <VarbListMenuDual
          {...{
            className: "ValueListGeneral-menu",
            menuType,
            ...rest,
          }}
        />
      </MuiRow>
      <FormSection
        sx={{
          flexDirection: "column",
          paddingBottom: 0,
          paddingTop: nativeTheme.s2,
          width: "100%",
        }}
      >
        {menuDisplayNames && (
          <CommonItemsList
            {...{
              sx: { marginBottom: nativeTheme.s4 },
              menuDisplayNames,
              ...rest,
            }}
          />
        )}

        {table}
      </FormSection>
    </Styled>
  );
}

const Styled = styled(Box)`
  .ValueListGeneral-menu {
    padding-bottom: ${nativeTheme.s3};
  }
`;
