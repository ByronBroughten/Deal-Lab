import { ThemeName } from "../../../theme/Theme";
import { VarbListGeneric } from "../ListGroup/ListGroupShared/VarbListGeneric";
import { UserVarbItem } from "./VarbListUserVarbs/UserVarbItem";

type Props = {
  feId: string;
  themeName: ThemeName;
  className?: string;
};

export function VarbListUserVarbs({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "userVarbList", feId } as const;
  return (
    <VarbListGeneric
      {...{
        ...rest,
        menuType: "simple",
        feInfo,
        contentTitle: "Value",
        makeItemNode: ({ feId }) => <UserVarbItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
