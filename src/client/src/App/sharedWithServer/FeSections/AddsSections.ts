import { applyMixins } from "../../utils/classObjects";
import {
  FeSectionPack,
  SectionPackSupplements,
} from "../Analyzer/FeSectionPack";
import { AddSectionProps } from "../Analyzer/methods/internal/addSections/addSectionsTypes";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import {
  OneRawSection,
  RawSections,
} from "../Analyzer/SectionPackRaw/RawSection";
import { SimpleSectionName } from "../SectionMetas/baseSections";
import { SectionFinder } from "../SectionMetas/baseSectionTypes";
import { FeInfo, InfoS } from "../SectionMetas/Info";
import { ChildName } from "../SectionMetas/relSectionTypes/ChildTypes";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../SectionMetas/SectionName";
import { Obj } from "../utils/Obj";
import FeSection from "./FeSection";
import { FeSections } from "./FeSections";

class HasFeSectionsCore {
  constructor(protected core: FeSections) {}
}

type FeSectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST & SectionNameType>]: SectionPackRaw<SN>[];
};
export class MakesSectionPacks extends HasFeSectionsCore {
  makeSectionPackArrs<ST extends SectionNameType>(
    snType: ST
  ): FeSectionPackArrs<ST> {
    const sectionNames = sectionNameS.arrs[snType] as string[];
    return sectionNames.reduce((spArrs, sectionName) => {
      spArrs[sectionName] = this.makeSectionPackArr(
        sectionName as SectionName<ST>
      );
      return spArrs;
    }, {} as { [key: string]: any[] }) as any;
  }
  makeSectionPackArr<SN extends SimpleSectionName>(
    sectionName: SN
  ): SectionPackRaw<SN>[] {
    const { feInfos } = this.core.list(sectionName);
    return feInfos.map((feInfo) => this.makeSectionPack(feInfo));
  }
  makeSectionPack<SN extends SimpleSectionName>(
    finder: SectionFinder<SN>
  ): SectionPackRaw<SN> {
    const { sectionName, dbId } = this.core.section(finder);
    return {
      sectionName: sectionName as SN,
      dbId,
      rawSections: this.makeRawSections(finder) as RawSections<SN>,
    } as SectionPackRaw<SN>;
  }
  protected makeRawSections<SN extends SimpleSectionName>(
    finder: SectionFinder<SN>
  ): RawSections<SN> {
    const nestedFeIds = this.core.selfAndDescendantFeIds(finder);
    return Obj.entries(nestedFeIds as { [key: string]: string[] }).reduce(
      (rawSections, [name, feIdArr]) => {
        rawSections[name] = this.feIdsToRawSections(name as SN, feIdArr);
        return rawSections;
      },
      {} as { [key: string]: any }
    ) as RawSections<SN>;
  }
  protected feIdsToRawSections<SN extends SimpleSectionName>(
    sectionName: SN,
    feIdArr: string[]
  ): OneRawSection<SN>[] {
    return feIdArr.map((id) => {
      const feInfo = InfoS.fe(sectionName, id);
      return this.makeRawSection(feInfo);
    });
  }
  protected makeRawSection<SN extends SimpleSectionName>(
    finder: SectionFinder<SN>
  ): OneRawSection<SN> {
    const { dbId, dbVarbs } = this.core.section(finder);
    return {
      dbId,
      dbVarbs,
      childDbIds: this.core.allChildDbIds(finder),
    };
  }
}

// Add loadSectionPack stuff and make addsSection see index.
export class AddsSectionsNext extends HasFeSectionsCore {
  addSections(parentFirstPropsArr: AddSectionProps[]) {
    for (const props of parentFirstPropsArr as AddSectionProps[]) {
      this.addSection(props);
    }
  }
  addSection({ idx, ...props }: AddSectionProps) {
    this.pushSectionToList(props);
    const { feInfo } = this.core.list(props.sectionName).last;
    if (InfoS.is.fe(feInfo, "hasParent")) {
      this.addToParentChildIds(feInfo, idx);
    }
  }
  private pushSectionToList(props: AddSectionProps) {
    const { sectionName, parentFinder } = props;
    this.core = this.core.updateList(
      this.core.list(sectionName).push(
        FeSection.initNext({
          parentInfo: this.core.parentFinderToInfo(parentFinder as any),
          ...props,
        })
      )
    );
  }
  private addToParentChildIds(feInfo: FeInfo<"hasParent">, idx?: number) {
    const parentSection = this.core.parent(feInfo);
    const nextParent = parentSection.addChildFeId(feInfo, idx);
    this.core = this.core.replaceInList(nextParent);
  }
}

class RemovesSections extends HasFeSectionsCore {
  wipeSectionList<SN extends SectionName>(sectionName: SN) {
    this.core = this.core.updateList(this.core.list(sectionName).wipe() as any);
  }
}

export interface LoadsSectionPacks extends AddsSectionsNext, RemovesSections {}
export class LoadsSectionPacks extends HasFeSectionsCore {
  // loadUserAndSolve(loginUser: LoginUser) {
  //   let next = this;

  //   for (const [sectionName, sectionPackArr] of Obj.entries(loginUser)) {
  //     next = internal.loadRawSectionPackArr(
  //       next,
  //       sectionName,
  //       sectionPackArr as SectionPackRaw<SectionName<"hasOneParent">>[]
  //     );
  //   }
  //   return next.solveVarbs();
  // },
  loadRawSectionPackArr<SN extends ChildName<"main">>(
    sectionName: SN,
    sectionPackArr: SectionPackRaw<SN>[]
  ) {
    this.wipeSectionList(sectionName);
    // const addSectionArrProps = getSectionArrAddSectionProps(
    //   next,
    //   sectionPackArr as Record<keyof SectionPackRaw<S>, any>[]
    // );
    // return internal.addSectionsNext(next, addSectionArrProps);
  }
  loadSectionPack<
    SN extends SimpleSectionName,
    Props extends SectionPackSupplements<SN>
  >(sectionPack: SectionPackRaw<SN>, props: Props): void {
    const feSectionPack = new FeSectionPack(sectionPack);
    const sectionNodes = feSectionPack.makeOrderedPreSections(props);
    return this.addSections(sectionNodes as AddSectionProps[]);
  }
}

applyMixins(LoadsSectionPacks, [AddsSectionsNext, RemovesSections]);

// function getSectionArrAddSectionProps(
//   next: Analyzer,
//   sectionPackArr: SectionPackRaw<SectionName<"hasOneParent">>[]
//   // this can take parentFinder
// ) {
//   return sectionPackArr.reduce((addSectionPropsArr, rawSectionPack) => {
//     const { sectionName } = rawSectionPack;
//     const feSectionPack = new FeSectionPack(rawSectionPack);

//     const addSectionProps = feSectionPack.makeOrderedPreSections({
//       parentFinder: next.parent(sectionName).feInfo,
//     });

//     return addSectionPropsArr.concat(addSectionProps);
//   }, [] as AddSectionProps[]);
// }

// export function loadRawSectionPackArr<S extends SectionName<"hasOneParent">>(
