import { Obj } from "../utils/Obj";
import { SectionVarbName } from "./baseSectionsDerived/baseSectionTypes";
import { SimpleSectionName } from "./baseSectionsVarbs";
import {
  ChildIdArrsNarrow,
  ChildIdArrsWide,
  ChildName,
  getChildNames,
} from "./childSectionsDerived/ChildName";
import {
  childrenSectionNames,
  ChildSectionName,
  ChildSectionNameName,
  childSectionNameNames,
  childToSectionName,
} from "./childSectionsDerived/ChildSectionName";
import { DbVarbs } from "./childSectionsDerived/SectionPack/RawSection";
import { relSections } from "./relSections";
import {
  CorePropName,
  sectionMetasCore,
  SectionsMetaCore,
} from "./sectionMetasCore";
import { SectionName } from "./SectionName";
import { VarbMeta } from "./VarbMeta";

export type VarbMetas<SN extends SimpleSectionName> = {
  [varbName: string]: VarbMeta<SN>;
};
type SectionMetaExtra<SN extends SimpleSectionName> = {
  varbMetas: VarbMetas<SN>;
};
export interface SectionMetaProps<SN extends SimpleSectionName>
  extends SectionMetaExtra<SN> {
  sectionName: SN;
}

type CoreProp<
  SN extends SimpleSectionName,
  PN extends CorePropName
> = SectionsMetaCore[SN][PN];

type CorePropNoNull<
  SN extends SimpleSectionName,
  PN extends CorePropName
> = Exclude<SectionsMetaCore[SN][PN], null>;

export class SectionMeta<SN extends SimpleSectionName> {
  constructor(readonly props: SectionMetaProps<SN>) {}
  get sectionName(): SN {
    return this.props.sectionName;
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
  get hasFeDisplayIndex(): boolean {
    if (this.core.feDisplayIndexStoreName) {
      return true;
    } else return false;
  }
  get hasFeFullIndex(): boolean {
    if (this.core.feFullIndexStoreName) {
      return true;
    } else return false;
  }
  get feDisplayIndexStoreName(): CorePropNoNull<SN, "feDisplayIndexStoreName"> {
    return this.propNoNull("feDisplayIndexStoreName");
  }
  get feFullIndexStoreName(): CorePropNoNull<SN, "feFullIndexStoreName"> {
    return this.propNoNull("feFullIndexStoreName");
  }
  get displayName(): string {
    return this.prop("displayName");
  }
  get varbListItem(): CoreProp<SN, "varbListItem"> {
    return this.prop("varbListItem");
  }
  varb(varbName: string): VarbMeta<SN> {
    const varbMeta = this.varbMetas[varbName];
    if (varbMeta === undefined) {
      throw new Error(`No varbMeta at ${this.sectionName}.${varbName}`);
    }
    return varbMeta;
  }
  propNoNull<PN extends CorePropName>(propName: PN): CorePropNoNull<SN, PN> {
    const prop = this.core[propName];
    if (prop === null) {
      throw new Error(
        `Prop at relSections.${this.sectionName}.${propName} is null`
      );
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
  isChildType(sectionName: SectionName): sectionName is ChildSectionName<SN> {
    return this.childTypes.includes(sectionName as any);
  }
  get childTypes(): ChildSectionName<SN>[] {
    return childrenSectionNames[this.sectionName] as ChildSectionName<SN>[];
  }
  childType<CN extends ChildName<SN>>(childName: CN): ChildSectionName<SN, CN> {
    return childToSectionName(this.sectionName, childName);
  }
  childTypeNames<CT extends SimpleSectionName>(
    childSectionName: CT
  ): ChildSectionNameName<SN, CT>[] {
    const csnsToCns = childSectionNameNames[this.sectionName] as {
      [key: string]: string[];
    };
    const childNames = csnsToCns[childSectionName] ?? [];
    return childNames as ChildSectionNameName<SN, CT>[];
  }
  get varbMetas(): VarbMetas<SN> {
    return this.props.varbMetas;
  }
  get varbNames(): string[] {
    return Obj.keys(this.varbMetas);
  }
  get varbNamesNext(): SectionVarbName<SN>[] {
    return Obj.keys(this.varbMetas) as any[];
  }
  isChildName(value: any): value is ChildName<SN> {
    return (this.childNames as string[]).includes(value);
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
  defaultDbVarbs(): DbVarbs {
    const defaultDbVarbs: DbVarbs = {};
    for (const [varbName, varbMeta] of Obj.entries(this.varbMetas)) {
      defaultDbVarbs[varbName] = varbMeta.initValue;
    }
    return defaultDbVarbs;
  }
  depreciatingUpdateVarbMeta(varbMeta: VarbMeta<SN>) {
    return new SectionMeta({
      ...this.props,
      varbMetas: {
        ...this.props.varbMetas,
        [varbMeta.varbName]: varbMeta,
      },
    });
  }
  static init<SN extends SimpleSectionName>(sectionName: SN): SectionMeta<SN> {
    const { relVarbs } = relSections[sectionName];
    const varbMetas = Obj.keys(relVarbs).reduce((vMetas, varbName) => {
      vMetas[varbName] = VarbMeta.init({ sectionName, varbName });
      return vMetas;
    }, {} as VarbMetas<SN>);

    return new SectionMeta({
      sectionName,
      varbMetas,
    });
  }
}
