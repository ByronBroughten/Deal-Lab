import { ObjectEntries } from "../../../utils/Obj";
import StateSection from "../../StateSection";
import { StateValueAnyKey, ValueTypesPlusAny } from "../StateVarb";
import { InEntityVarbInfo } from "../../SectionMetas/relSections/baseSections/baseValues/NumObj/numObjInEntitites";
import { SectionName } from "../../SectionMetas/SectionName";

export function value<T extends StateValueAnyKey, S extends SectionName>(
  this: StateSection<S>,
  varbName: string,
  valueType?: T
): ValueTypesPlusAny[T];
export function value<S extends SectionName>(
  this: StateSection<S>,
  varbName: string,
  valueType: StateValueAnyKey = "any"
) {
  return this.varb(varbName).value(valueType);
}

type ValuesProps = {
  [varbName: string]: StateValueAnyKey;
};
export function values<
  S extends SectionName,
  T extends ValuesProps,
  M extends { [Prop in keyof T]: ValueTypesPlusAny[T[Prop]] }
>(this: StateSection<S>, varbTypes: T): M {
  const partial = ObjectEntries(varbTypes).reduce(
    (partial, [varbName, varbType]) => {
      partial[varbName] = this.value(varbName as any, varbType) as any;
      return partial;
    },
    {} as Partial<M>
  );
  return partial as M;
}
export function varbInfoValues<S extends SectionName>(this: StateSection<S>) {
  return this.values({
    sectionName: "string",
    varbName: "string",
    id: "string",
    idType: "string",
  }) as InEntityVarbInfo;
}
