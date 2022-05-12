import { GConstructor } from "../../../utils/classObjects";
import { AddSectionPropsNext } from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import { FeSectionInfo, InfoS } from "../../SectionMetas/Info";
import {
  ChildName,
  DescendantName,
  NewSectionInfo,
  SelfOrDescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../../SectionMetas/SectionName";
import { StrictOmit } from "../../utils/types";
import { FeSection } from "../FeSection";
import { SectionInfoGettersI } from "../HasSectionInfoProps";
import { HasFullSectionProps } from "./HasFullSectionProps";
import { SectionAccessor } from "./SectionAccessor";
import { FeSections } from "./Sections";

export type DescendantList<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = readonly [...DescendantName<SN>[], DN];

export type AddChildOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = StrictOmit<AddSectionPropsNext<CN>, "sectionName" | "parentInfo">;

export type AddDescendantOptions<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = StrictOmit<AddSectionPropsNext<DN>, "parentInfo" | "sectionName">;

export interface DescendantAdderI<SN extends SectionName>
  extends DescendantAdderMixins<SN> {
  addDescendant<DN extends DescendantName<SN>>(
    descendantPath: DescendantList<SN, DN>,
    props: AddDescendantOptions<SN, DN>
  ): void;
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    props: AddChildOptions<SN>
  ): void;
  addOneSection<S extends SectionName>(props: AddSectionPropsNext<S>): void;
  addSections(parentFirstPropsArr: AddSectionPropsNext[]): void;
}

interface DescendantAdderMixins<SN extends SectionName>
  extends HasFullSectionProps<SN>,
    SectionInfoGettersI<SN> {}

export function ApplyDescendantAdder<
  SN extends SectionName,
  TBase extends GConstructor<DescendantAdderMixins<SN>>
>(Base: TBase): GConstructor<DescendantAdderI<SN>> & TBase {
  return class DescendantAdderNext
    extends Base
    implements DescendantAdderI<SN>
  {
    addDescendant<DN extends DescendantName<SN>>(
      descendantPath: DescendantList<SN, DN>,
      props: AddDescendantOptions<SN, DN> = {}
    ): void {
      let { sectionName, feId } = this.info as FeSectionInfo<
        SelfOrDescendantName<SN>
      >;

      for (let i = 0; i < descendantPath.length; i++) {
        const childName = descendantPath[i];
        if (
          this.isValidChildNameOrThrow(sectionName as SectionName, childName)
        ) {
          const commonProps = {
            parentInfo: InfoS.fe(sectionName as SectionName, feId) as any,
            sectionName: childName,
          };
          if (i === descendantPath.length - 1) {
            this.addOneSection({
              ...props,
              ...commonProps,
            });
          } else if (this.sections.list(childName).isEmpty) {
            this.addOneSection(commonProps);
          }
        }
        ({ sectionName, feId } = {
          sectionName: childName as any,
          feId: this.sections.list(childName).last.feId,
        });
      }
    }
    addChild<CN extends ChildName<SN>>(
      childName: CN,
      props: AddChildOptions<SN>
    ): void {
      this.addOneSection({
        sectionName: childName,
        ...props,
        parentInfo: this.feInfo as any,
      } as AddSectionPropsNext<DescendantName<SN>>);
    }
    addOneSection<S extends SectionName>(props: AddSectionPropsNext<S>): void {
      this.newSectionToList(props);
      if (sectionNameS.is(props.sectionName, "hasParent")) {
        this.addChildFeIdToParent(
          props as AddSectionPropsNext<SectionName<"hasParent">>
        );
      }
    }
    addSections(parentFirstPropsArr: AddSectionPropsNext[]): void {
      for (const props of parentFirstPropsArr as AddSectionPropsNext[]) {
        this.addOneSection(props);
      }
    }
    private get sections(): FeSections {
      return this.core.sections;
    }
    private setSections(sections: FeSections) {
      this.core.sections = sections;
    }
    private isValidChildNameOrThrow<SN extends SectionName>(
      sectionName: SN,
      childName: SectionName
    ): childName is ChildName<SN> {
      const meta = this.sectionMeta(sectionName);
      if (!meta.isChildName(childName)) {
        throw new Error(`${childName} is not a child of ${sectionName}`);
      } else return true;
    }
    private newSectionToList(props: AddSectionPropsNext) {
      const { sectionName } = props;
      const sectionList = this.sections.list(sectionName);
      const nextSections = this.sections.updateList(
        sectionList.push(FeSection.initNext(props))
      );
      this.setSections(nextSections);
    }
    private addChildFeIdToParent(
      props: StrictOmit<NewSectionInfo<"hasParent">, "feId">
    ) {
      const { parentInfo, feId } = this.sections.list(props.sectionName).last;
      const parent = this.sections
        .one(parentInfo)
        .addChildFeId({ ...props, feId });
      const nextSections = this.sections.updateSection(parent as any);
      this.setSections(nextSections);
    }
  };
}

export class DescendantAdder<
  SN extends SectionName
> extends SectionAccessor<SN> {
  addDescendant<DN extends DescendantName<SN>>(
    descendantPath: DescendantList<SN, DN>,
    props: AddDescendantOptions<SN, DN> = {}
  ) {
    let { sectionName, feId } = this.info as FeSectionInfo<
      SelfOrDescendantName<SN>
    >;

    for (let i = 0; i < descendantPath.length; i++) {
      const childName = descendantPath[i];
      if (this.isValidChildNameOrThrow(sectionName as SectionName, childName)) {
        const commonProps = {
          parentInfo: InfoS.fe(sectionName as SectionName, feId) as any,
          sectionName: childName,
        };
        if (i === descendantPath.length - 1) {
          this.addOneSection({
            ...props,
            ...commonProps,
          });
        } else if (this.sectionList(childName).isEmpty) {
          this.addOneSection(commonProps);
        }
      }
      ({ sectionName, feId } = {
        sectionName: childName as any,
        feId: this.sectionList(childName).last.feId,
      });
    }
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    props: AddChildOptions<SN>
  ) {
    this.addOneSection({
      sectionName: childName,
      ...props,
      parentInfo: this.feInfo as any,
    } as AddSectionPropsNext<DescendantName<SN>>);
  }
  protected addOneSection<S extends SectionName>(
    props: AddSectionPropsNext<S>
  ) {
    this.newSectionToList(props);
    if (sectionNameS.is(props.sectionName, "hasParent")) {
      this.addChildFeIdToParent(
        props as AddSectionPropsNext<SectionName<"hasParent">>
      );
    }
  }
  protected addSections(parentFirstPropsArr: AddSectionPropsNext[]) {
    for (const props of parentFirstPropsArr as AddSectionPropsNext[]) {
      this.addOneSection(props);
    }
  }
  private isValidChildNameOrThrow<SN extends SectionName>(
    sectionName: SN,
    childName: SectionName
  ): childName is ChildName<SN> {
    const meta = this.sectionMeta(sectionName);
    if (!meta.isChildName(childName)) {
      throw new Error(`${childName} is not a child of ${sectionName}`);
    } else return true;
  }
  private newSectionToList(props: AddSectionPropsNext) {
    const { sectionName } = props;
    this.sections = this.sections.updateList(
      this.sectionList(sectionName).push(FeSection.initNext(props))
    );
  }
  private addChildFeIdToParent(
    props: StrictOmit<NewSectionInfo<"hasParent">, "feId">
  ) {
    const { parentInfo, feId } = this.sections.list(props.sectionName).last;
    const parent = this.sections
      .one(parentInfo)
      .addChildFeId({ ...props, feId });
    this.sections = this.sections.updateSection(parent as any);
  }
}
