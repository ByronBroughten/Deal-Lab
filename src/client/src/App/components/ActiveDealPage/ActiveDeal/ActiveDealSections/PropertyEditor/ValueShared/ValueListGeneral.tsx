import { Box } from "@mui/material";
import styled from "styled-components";
import { FeSectionInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSection } from "../../../../../appWide/FormSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListMenuDual } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListMenuDual";
import { ListRouteName } from "../../../../../UserListEditorPage/UserComponentClosed";
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
        alignItems: "center",
        flex: 1,
      }}
      className={`ValueListGeneral-root ${className ?? ""}`}
    >
      <VarbListMenuDual
        {...{
          className: "ValueListGeneral-menu",
          menuType,
          ...rest,
        }}
      />
      <FormSection sx={{ flexDirection: "column" }}>
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
