import { sectionMetas } from "../../../SectionsMeta";
import { VarbNames } from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { DbValue } from "../../../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../../../SectionsMeta/SectionName";
import FeVarb from "../FeVarb";
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
  return new FeVarb(initCore(props));
}

export type FeVarbCore<
  SN extends SectionName<"hasVarb"> = SectionName<"hasVarb">
> = {
  varbName: string;
  sectionName: SN;
  feId: string;
  value: StateValue;
  outEntities: OutEntity[];
  manualUpdateEditorToggle: boolean | undefined; // filled with stateManager to ensure rerenders upon loading varbs
};

function initCore({ dbVarb, ...rest }: NextStateVarbInitProps): FeVarbCore {
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
