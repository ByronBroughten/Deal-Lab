import { ThemeName } from "../../../theme/Theme";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { OutputItem } from "./VarbListUserVarbs/OutputItem";

type Props = {
  feId: string;
  themeName: ThemeName;
  className?: string;
  menuType: VarbListGenericMenuType;
};

export function VarbListOutputs({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "outputList", feId } as const;
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo,
        contentTitle: "Value",
        makeItemNode: ({ feId }) => <OutputItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
