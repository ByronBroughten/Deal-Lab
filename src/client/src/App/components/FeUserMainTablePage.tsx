import { FeStoreNameByType } from "../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { ThemeName } from "../theme/Theme";
import { CompareTablePage } from "./CompareTablePage";

const titles = {
  propertyMainTable: "Properties",
  loanMainTable: "Loans",
  mgmtMainTable: "Managements",
  dealMainTable: "Deals",
};

type Props = {
  mainTableName: FeStoreNameByType<"mainTableName">;
  $themeName: ThemeName;
};
export function FeUserMainTablePage({ mainTableName, $themeName }: Props) {
  const feUser = useGetterSectionOnlyOne("feUser");
  const { dbIndexName } = feUser.meta.relChildren[mainTableName];
  return (
    <CompareTablePage
      {...{
        feId: feUser.onlyChild(mainTableName).feId,
        rowSourceName: dbIndexName,
        title: titles[mainTableName],
        $themeName,
      }}
    />
  );
}
