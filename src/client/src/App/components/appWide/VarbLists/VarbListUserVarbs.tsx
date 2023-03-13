import { VarbListGeneric } from "../ListGroup/ListGroupShared/VarbListGeneric";
import { UserVarbItem } from "./VarbListUserVarbs/UserVarbItem";

type Props = {
  feId: string;
  className?: string;
};

export function VarbListUserVarbs({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "numVarbList", feId } as const;
  return (
    <VarbListGeneric
      {...{
        ...rest,
        menuType: "editorPage",
        feInfo,
        contentTitle: "Value",
        makeItemNode: ({ feId }) => <UserVarbItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
