import { SectionNameProp } from "../../SectionsMeta/baseSectionsDerived/baseSectionInfo";
import { SectionMeta } from "../../SectionsMeta/SectionMeta";
import { SectionName } from "../../SectionsMeta/SectionName";
import {
  GetterListBase,
  GetterListProps,
} from "../../StateGetters/Bases/GetterListBase";
import { GetterList } from "../../StateGetters/GetterList";
import { SolverSectionsBase, SolverSectionsProps } from "./SolverSectionsBase";

export interface SolverListProps<SN extends SectionName>
  extends SolverSectionsProps,
    SectionNameProp<SN> {}

export class SolverListBase<SN extends SectionName> extends SolverSectionsBase {
  readonly getterListBase: GetterListBase<SN>;
  constructor(props: SolverListProps<SN>) {
    super(props);
    this.getterListBase = new GetterListBase(props);
  }
  get getL() {
    return new GetterList(this.getterListProps);
  }
  get sectionMeta(): SectionMeta<SN> {
    return this.getL.sectionMeta;
  }
  get getterListProps(): GetterListProps<SN> {
    return this.getterListBase.getterListProps;
  }
  get solverSectionProps(): SolverListProps<SN> {
    return {
      ...this.getterListProps,
      ...this.solverSectionsProps,
    };
  }
}
