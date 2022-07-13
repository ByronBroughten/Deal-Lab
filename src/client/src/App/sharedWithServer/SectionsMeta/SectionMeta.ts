import { DbVarbs } from "../SectionPack/RawSection";
import { Obj } from "../utils/Obj";
import { SimpleSectionName } from "./baseSections";
import {
  ChildIdArrsNarrow,
  ChildIdArrsWide,
  ChildName,
  sectionToChildNames,
} from "./childSectionsDerived/ChildName";
import {
  childrenSectionNames,
  ChildSectionName,
  ChildSectionNameName,
  childSectionNameNames,
  childToSectionNames,
} from "./childSectionsDerived/ChildSectionName";
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
  get tableStoreName(): CorePropNoNull<SN, "tableStoreName"> {
    return this.propNoNull("tableStoreName");
  }
  get feTableIndexStoreName(): CorePropNoNull<SN, "feTableIndexStoreName"> {
    return this.propNoNull("feTableIndexStoreName");
  }
  get displayName(): string {
    return this.prop("displayName");
  }
  get varbListItem(): CoreProp<SN, "varbListItem"> {
    return this.prop("varbListItem");
  }
  varb(varbName: string): VarbMeta<SN> {
    return this.varbMetas[varbName];
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
    return sectionToChildNames[this.sectionName] as ChildName<SN>[];
  }
  isChildType(sectionName: SectionName): sectionName is ChildSectionName<SN> {
    return this.childTypes.includes(sectionName as any);
  }
  get childTypes(): ChildSectionName<SN>[] {
    return childrenSectionNames[this.sectionName] as ChildSectionName<SN>[];
  }
  childType<CN extends ChildName<SN>>(childName: CN): ChildSectionName<SN, CN> {
    const names = childToSectionNames[this.sectionName] as {
      [key: string]: string;
    };
    if (!names || !names[childName]) {
      throw new Error(
        `childName "${childName}" did not yield a childType from parent of type ${this.sectionName}`
      );
    }
    return names[childName] as ChildSectionName<SN, CN>;
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
