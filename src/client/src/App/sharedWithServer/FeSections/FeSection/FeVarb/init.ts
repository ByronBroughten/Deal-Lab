import { sectionMetas } from "../../../SectionMetas";
import { VarbNames } from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { DbValue } from "../../../SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import StateVarb, { NextStateVarbCore } from "../FeVarb";
import { OutEntity } from "./entities";
import { StateValue } from "./feValue";

type NextStateVarbInitProps = {
  varbName: string;
  sectionName: SectionName;
  feId: string;
  outEntities?: OutEntity[];
  manualUpdateEditorToggle?: boolean | undefined;
  dbVarb?: DbValue;
};

export function initStateVarb(props: NextStateVarbInitProps) {
  return new StateVarb(initCore(props));
}

function initCore({
  dbVarb,
  ...rest
}: NextStateVarbInitProps): NextStateVarbCore {
  return {
    value: dbToFeValue({ ...rest, sectionContext: "fe" }, dbVarb),
    manualUpdateEditorToggle: undefined,
    outEntities: [],
    ...rest,
  };
}

function getValidDbValue(
  varbNames: VarbNames<SectionName>,
  dbValue: DbValue | undefined
): DbValue {
  const valueMeta = sectionMetas.value(varbNames, "fe");
  return valueMeta.isRaw(dbValue)
    ? dbValue
    : (valueMeta.dbInitValue as DbValue);
}
function dbToFeValue(
  varbNames: VarbNames<SectionName>,
  proposedDbValue: DbValue | undefined
) {
  const dbValue = getValidDbValue(varbNames, proposedDbValue);
  const valueMeta = sectionMetas.value(varbNames, "fe");
  const value = (valueMeta.rawToState as (_: DbValue) => StateValue)(dbValue);
  return value;
}
