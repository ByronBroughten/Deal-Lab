import styled from "styled-components";
import { FeSectionInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import theme from "../../../../../../theme/Theme";
import { FormSection } from "../../../../../appWide/FormSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListMenuDual } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListMenuDual";
import { AddWithDisplayName, CommonItemsList } from "./CommonItemsList";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  onChange: AddWithDisplayName;
  className?: string;
  menuType: VarbListGenericMenuType;
  menuDisplayNames?: readonly string[];
  itemDisplayNames?: readonly string[];
  table: React.ReactNode;
}

export function ValueListGeneral<
  SN extends SectionNameByType<"varbListAllowed">
>({ className, menuType, table, menuDisplayNames, ...rest }: Props<SN>) {
  return (
    <Styled className={`ValueListGeneral-root ${className ?? ""}`}>
      <VarbListMenuDual
        {...{
          className: "ValueListGeneral-menu",
          menuType,
          ...rest,
        }}
      />
      <FormSection className="ValueListGeneral-itemSection">
        {menuDisplayNames && (
          <CommonItemsList
            {...{
              className: "ValueListGeneral-commonItemsList",
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

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: "center";
  flex: 1;
  .ValueListGeneral-itemSection {
    flex-direction: column;
  }
  .ValueListGeneral-commonItemsList {
    margin-bottom: ${theme.s4};
  }

  .ValueListGeneral-menu {
    padding-bottom: ${nativeTheme.s3};
  }
  .ValueListGeneral-checkBoxList {
    padding-top: ${theme.s2};
  }
  .ValueListGeneral-table {
    margin-top: ${theme.s4};
  }
`;
