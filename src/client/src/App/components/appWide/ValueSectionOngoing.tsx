import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ValueSectionGeneric } from "./ValueSectionGeneric";
import { VarbListOngoing } from "./VarbLists/VarbListOngoing";

interface Props {
  className?: string;
  feId: string;
  displayName?: string;
}

export function ValueSectionOngoing({ feId, ...rest }: Props) {
  const section = useSetterSection({
    sectionName: "ongoingValue",
    feId,
  });
  const valueVarb = section.get.switchVarb("value", "ongoing");
  const { endAdornment, varbName } = valueVarb;
  return (
    <ValueSectionGeneric
      {...{
        ...rest,
        sectionName: "ongoingValue",
        feId,
        valueName: varbName as "valueMonthly",
        endAdornment,
        makeItemizedListNode: (props) => <VarbListOngoing {...props} />,
      }}
    />
  );
}
