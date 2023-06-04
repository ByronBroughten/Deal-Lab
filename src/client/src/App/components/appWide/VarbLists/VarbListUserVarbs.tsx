import { VarbListGeneric } from "../ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
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
        headers: <VarbListStandardHeaders contentTitle={"Value"} />,
        menuType: "editorPage",
        feInfo,
        makeItemNode: ({ feId }) => <UserVarbItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
