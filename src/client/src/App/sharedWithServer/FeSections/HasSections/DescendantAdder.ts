import { GConstructor } from "../../../utils/classObjects";
import { AddSectionPropsNext } from "../../Analyzer/methods/internal/addSections/addSectionsTypes";
import {
  FullSectionBase,
  FullSectionBaseI,
} from "../../SectionFocal/FocalSectionBase";
import { FeInfoByType, InfoS } from "../../SectionsMeta/Info";
import {
  ChildName,
  DescendantName,
  NewSectionInfo,
  SelfOrDescendantName,
} from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName, sectionNameS } from "../../SectionsMeta/SectionName";
import { FeSection } from "../../SectionsState/FeSection";
import { FeSections } from "../../SectionsState/SectionsState";
import { StrictOmit } from "../../utils/types";

export interface DescendantAdderI<SN extends SectionName>
  extends FullSectionBaseI<SN> {
  addDescendant<DN extends DescendantName<SN>>(
    descendantPath: DescendantList<SN, DN>,
    props: AddDescendantOptions<SN, DN>
  ): void;
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    props?: AddChildOptions<SN>
  ): void;
  addOneSection<S extends SectionName>(props: AddSectionPropsNext<S>): void;
  addSections(parentFirstPropsArr: AddSectionPropsNext[]): void;
}

export function ApplyDescendantAdder<
  SN extends SectionName,
  TBase extends GConstructor<FullSectionBaseI<SN>>
>(Base: TBase): GConstructor<DescendantAdderI<SN>> & TBase {
  return class DescendantAdderNext
    extends Base
    implements DescendantAdderI<SN>
  {
    addDescendant<DN extends DescendantName<SN>>(
      descendantPath: DescendantList<SN, DN>,
      props: AddDescendantOptions<SN, DN> = {}
    ): void {
      let { sectionName, feId } = this.info as FeInfoByType<
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
      options?: AddChildOptions<SN>
    ): void {
      this.addOneSection({
        ...options,
        sectionName: childName,
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
    private setSections(sections: FeSections) {
      this.shared.sections = sections;
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

export const DescendantAdderNext = ApplyDescendantAdder(FullSectionBase);

export type DescendantList<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = readonly [...DescendantName<SN>[], DN];

type OmitProps = "sectionName" | "parentInfo" | "childFeIds";

export type AddChildOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = StrictOmit<AddSectionPropsNext<CN>, OmitProps>;

export type AddDescendantOptions<
  SN extends SectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> = StrictOmit<AddSectionPropsNext<DN>, OmitProps>;
