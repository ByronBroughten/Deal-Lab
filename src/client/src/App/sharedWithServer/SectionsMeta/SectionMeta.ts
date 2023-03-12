import { Obj } from "../utils/Obj";
import {
  getSectionTraits,
  GetSectionTraits,
  SectionTrait,
  sectionTrait,
} from "./allSectionTraits";
import {
  sectionVarbNames,
  VarbName,
} from "./baseSectionsDerived/baseSectionsVarbsTypes";
import {
  allChildrenTraits,
  ChildrenTraits,
  GenericChildTraits,
} from "./childrenTraits";
import {
  ChildIdArrsNarrow,
  ChildIdArrsWide,
  ChildName,
  getChildNames,
  isChildName,
} from "./sectionChildrenDerived/ChildName";
import {
  childrenSectionNames,
  ChildSectionName,
  ChildSectionNameName,
  childToSectionName,
  sectionChildNameNames,
} from "./sectionChildrenDerived/ChildSectionName";
import { SectionValuesGeneric } from "./sectionChildrenDerived/SectionPack/RawSection";
import {
  CorePropName,
  sectionMetasCore,
  SectionsMetaCore,
} from "./sectionMetasCore";
import { SectionName } from "./SectionName";
import { SectionNameByType } from "./SectionNameByType";
import { VarbMeta } from "./VarbMeta";

export type VarbMetas<SN extends SectionName> = {
  [varbName: string]: VarbMeta<SN>;
};
type SectionMetaExtra<SN extends SectionName> = {
  varbMetas: VarbMetas<SN>;
};
export interface SectionMetaProps<SN extends SectionName>
  extends SectionMetaExtra<SN> {
  sectionName: SN;
}

type CoreProp<
  SN extends SectionName,
  PN extends CorePropName
> = SectionsMetaCore[SN][PN];

type CorePropNoNull<SN extends SectionName, PN extends CorePropName> = Exclude<
  SectionsMetaCore[SN][PN],
  null
>;

export class SectionMeta<SN extends SectionName> {
  constructor(readonly props: SectionMetaProps<SN>) {}
  get sectionName(): SN {
    return this.props.sectionName;
  }
  childMeta<CN extends ChildName<SN>>(
    childName: CN
  ): SectionMeta<ChildSectionName<SN, CN>> {
    const sectionName = this.childType(childName);
    return SectionMeta.init(sectionName);
  }
  get sectionTraits(): GetSectionTraits<SN> {
    return getSectionTraits(this.sectionName);
  }
  get core() {
    return sectionMetasCore[this.sectionName];
  }
  get dbIndexStoreName(): CorePropNoNull<SN, "dbIndexStoreName"> {
    return this.propNoNull("dbIndexStoreName");
  }
  get compareTableName(): CorePropNoNull<SN, "compareTableName"> {
    return this.propNoNull("compareTableName");
  }
  get hasFeFullIndex(): boolean {
    if (this.sectionTraits.feIndexStoreName) {
      return true;
    } else return false;
  }
  get feIndexStoreName(): CorePropNoNull<SN, "feIndexStoreName"> {
    return this.propNoNull("feIndexStoreName");
  }
  get displayName(): SectionTrait<SN, "displayName"> {
    return sectionTrait(this.sectionName, "displayName");
  }
  get varbListItem(): CoreProp<SN, "varbListItem"> {
    return this.prop("varbListItem");
  }
  varb(varbName: string): VarbMeta<SN> {
    const varbMeta = this.varbMetas[varbName];
    if (varbMeta === undefined) {
      throw new Error(`No varbMeta at ${this.sectionName}.${varbName}`);
    } else return varbMeta;
  }
  propNoNull<PN extends CorePropName>(propName: PN): CorePropNoNull<SN, PN> {
    const prop = this.core[propName];
    if (prop === null) {
      throw new Error(`Prop at this.core.${propName} is null`);
    }
    return prop as CorePropNoNull<SN, PN>;
  }
  prop<PN extends CorePropName>(propName: PN): CoreProp<SN, PN> {
    return this.core[propName];
  }
  get parentNames(): CoreProp<SN, "parentNames"> {
    return this.prop("parentNames");
  }
  get childNames(): ChildName<SN>[] {
    return getChildNames(this.sectionName);
  }
  isChildType(
    sectionName: SectionNameByType
  ): sectionName is ChildSectionName<SN> {
    return this.childTypes.includes(sectionName as any);
  }
  get childTypes(): ChildSectionName<SN>[] {
    return childrenSectionNames[this.sectionName] as ChildSectionName<SN>[];
  }
  childType<CN extends ChildName<SN>>(childName: CN): ChildSectionName<SN, CN> {
    return childToSectionName(this.sectionName, childName);
  }
  childTypeNames<CT extends SectionName>(
    sectionChildName: CT
  ): ChildSectionNameName<SN, CT>[] {
    const csnsToCns = sectionChildNameNames[this.sectionName] as {
      [key: string]: string[];
    };
    const childNames = csnsToCns[sectionChildName] ?? [];
    return childNames as ChildSectionNameName<SN, CT>[];
  }
  get childrenTraits(): ChildrenTraits<SN> {
    return allChildrenTraits[this.sectionName];
  }
  childTraits<CN extends ChildName<SN>>(childName: CN): GenericChildTraits {
    return this.childrenTraits[
      childName as CN & keyof ChildrenTraits<SN>
    ] as any;
  }
  get varbMetas(): VarbMetas<SN> {
    return this.props.varbMetas;
  }
  get varbNames(): string[] {
    return Obj.keys(this.varbMetas);
  }
  hasVarbName(varbName: string): boolean {
    return this.varbNames.includes(varbName);
  }
  get varbNamesNext(): VarbName<SN>[] {
    return Obj.keys(this.varbMetas) as any[];
  }
  isVarbName(value: any): value is VarbName<SN> {
    return this.varbNamesNext.includes(value);
  }
  isChildName(value: any): value is ChildName<SN> {
    return isChildName(this.sectionName, value);
  }
  emptyChildIdsWide(): ChildIdArrsWide<SN> {
    return this.childNames.reduce((childIds, childName) => {
      childIds[childName] = [];
      return childIds;
    }, {} as ChildIdArrsWide<SN>);
  }
  emptyChildIdsNarrow(): ChildIdArrsNarrow<SN> {
    return this.emptyChildIdsWide() as any as ChildIdArrsNarrow<SN>;
  }
  defaultDbVarbs(): SectionValuesGeneric {
    const defaultDbVarbs: SectionValuesGeneric = {};
    for (const [varbName, varbMeta] of Obj.entries(this.varbMetas)) {
      defaultDbVarbs[varbName] = varbMeta.initValue;
    }
    return defaultDbVarbs;
  }
  static init<SN extends SectionName>(sectionName: SN): SectionMeta<SN> {
    const varbNames = sectionVarbNames(sectionName);
    const varbMetas = varbNames.reduce((vMetas, varbName) => {
      vMetas[varbName as string] = new VarbMeta({
        sectionName,
        varbName: varbName as string,
      });
      return vMetas;
    }, {} as VarbMetas<SN>);

    return new SectionMeta({
      sectionName,
      varbMetas,
    });
  }
}
