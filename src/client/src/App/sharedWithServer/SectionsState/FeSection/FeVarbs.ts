import { GConstructor } from "../../../utils/classObjects";
import { DbVarbs } from "../../Analyzer/SectionPackRaw/RawSection";
import {
  InEntities,
  InEntityVarbInfo,
} from "../../SectionsMeta/baseSections/baseValues/entities";
import { InfoS } from "../../SectionsMeta/Info";
import {
  FeVarbInfo,
  MultiVarbInfo,
} from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { OutUpdatePack } from "../../SectionsMeta/VarbMeta";
import { Obj } from "../../utils/Obj";
import {
  ApplySectionInfoGetters,
  SectionInfoGettersI,
} from "../HasSectionInfoProps";
import FeVarb, { StateValueAnyKey, ValueTypesPlusAny } from "./FeVarb";
import { OutEntity } from "./FeVarb/entities";
import {
  FeVarbsCore,
  initFeVarbsCore,
  InitFeVarbsCoreProps,
} from "./FeVarbs/FeVarbsCore";
import { HasFeVarbsProps } from "./FeVarbs/HasFeVarbsProps";

export interface FeVarbsI<SN extends SectionName> extends TopMixins<SN> {
  one(varbName: string): FeVarb;
  value<T extends StateValueAnyKey = "any">(
    varbName: string,
    valueType?: T
  ): ValueTypesPlusAny[T];
  values<T extends ValuesRequest>(varbTypes: T): RequestedValues<T>;
  get varbInfoValues(): InEntityVarbInfo;
  replaceOne(nextVarb: FeVarb): FeVarbsI<SN>;
  update(partial: FeVarbsCore<SN>): FeVarbsI<SN>;
  get db(): DbVarbs;
  get arr(): FeVarb[];
  get entities(): InEntities;
  get outEntities(): OutEntity[];
  get outPacks(): OutUpdatePack[];
  get infos(): FeVarbInfo[];
}

interface TopMixins<SN extends SectionName>
  extends HasFeVarbsProps<SN>,
    SectionInfoGettersI<SN> {}

type FeVarbsConstructor<SN extends SectionName> = GConstructor<TopMixins<SN>>;

interface FeVarbsStatic {
  init<S extends SectionName>(props: InitFeVarbsCoreProps<S>): FeVarbsI<S>;
}

interface FullClass<SN extends SectionName>
  extends GConstructor<FeVarbsI<SN>> {}

function MakeFeVarbs<
  SN extends SectionName,
  TBase extends FeVarbsConstructor<SN>
>(Base: TBase): FullClass<SN> {
  return class FeVarbs extends Base implements FeVarbsI<SN> {
    one(varbName: string): FeVarb {
      const varb = this.core.varbs[varbName];
      if (!varb) throw varbNotFound(InfoS.feVarb(varbName, this.feInfo));
      return varb;
    }
    value<T extends StateValueAnyKey = "any">(
      varbName: string,
      valueType?: T
    ): ValueTypesPlusAny[T] {
      return this.one(varbName).value(valueType);
    }
    values<T extends ValuesRequest>(varbTypes: T): RequestedValues<T> {
      return Obj.entriesFull(varbTypes).reduce(
        (partial, [varbName, varbType]) => {
          partial[varbName] = this.value(varbName as string, varbType) as any;
          return partial;
        },
        {} as RequestedValues<T>
      );
    }
    replaceOne(nextVarb: FeVarb): FeVarbsI<SN> {
      const { varbName } = nextVarb;
      return this.update({
        varbs: {
          ...this.core.varbs,
          [varbName]: nextVarb,
        },
      });
    }
    update(partial: Partial<FeVarbsCore<SN>>): FeVarbsI<SN> {
      return new FeVarbs({
        ...this.core,
        ...partial,
      });
    }
    get varbInfoValues(): InEntityVarbInfo {
      return this.values({
        sectionName: "string",
        varbName: "string",
        id: "string",
        idType: "string",
      }) as InEntityVarbInfo;
    }
    get db(): DbVarbs {
      // why would this be undefined?
      return Object.entries(this.core.varbs).reduce(
        (dbVarbs, [varbName, varb]) => {
          dbVarbs[varbName] = varb.toDbValue();
          return dbVarbs;
        },
        {} as DbVarbs
      );
    }
    get arr(): FeVarb[] {
      return Object.values(this.core.varbs);
    }
    get entities(): InEntities {
      return this.arr.reduce((inEntities, varb) => {
        inEntities = inEntities.concat(varb.inEntities);
        return inEntities;
      }, [] as InEntities);
    }
    get outEntities(): OutEntity[] {
      return this.arr.reduce((outEntities, varb) => {
        return outEntities.concat(varb.outEntities);
      }, [] as OutEntity[]);
    }
    get outPacks(): OutUpdatePack[] {
      return this.arr.reduce((outUpdatePacks, varb) => {
        return outUpdatePacks.concat(varb.outUpdatePacks);
      }, [] as OutUpdatePack[]);
    }
    get infos(): FeVarbInfo[] {
      const { feInfo } = this;
      return Object.keys(this.core.varbs).map((varbName) => ({
        ...feInfo,
        varbName,
      })) as FeVarbInfo[];
    }
    // static init<S extends SectionName>(
    //   props: InitFeVarbsCoreProps<S>
    // ): FeVarbsI<S> {
    //   const core = initFeVarbsCore(props);
    //   const test = new FeVarbs(core);
    //   return new FeVarbs(core) as FeVarbsI<S>;
    // }
  };
}

const HasSectionInfoGetters = ApplySectionInfoGetters(HasFeVarbsProps);
export const FeVarbs = MakeFeVarbs(HasSectionInfoGetters);

export function initFeVarbs<SN extends SectionName>(
  props: InitFeVarbsCoreProps<SN>
): FeVarbsI<SN> {
  const core = initFeVarbsCore(props);
  return new FeVarbs(core) as any as FeVarbsI<SN>;
}

type ValuesRequest = {
  [varbName: string]: StateValueAnyKey;
};

type RequestedValues<T extends ValuesRequest> = {
  [Prop in keyof T]: ValueTypesPlusAny[T[Prop]];
};

function varbNotFound({ varbName, sectionName, idType, id }: MultiVarbInfo) {
  return new Error(
    `There is no varb at ${sectionName}.${id}.${varbName} with idType ${idType}.`
  );
}
