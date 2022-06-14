import { FeInfoByType } from "../../../sharedWithServer/SectionsMeta/Info";
import { ThemeName } from "../../../theme/Theme";
import { VarbListGeneric } from "../ListGroupShared/VarbListGeneric";
import { UserVarbItem } from "./VarbListUserVarbs/UserVarbItem";

type Props = {
  feInfo: FeInfoByType<"userVarbList">;
  themeName: ThemeName;
};

export function VarbListUserVarbs(props: Props) {
  return (
    <VarbListGeneric
      {...{
        ...props,
        itemName: "userVarbItem",
        contentTitle: "Value",
        makeItemNode: ({ feId }) => <UserVarbItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
