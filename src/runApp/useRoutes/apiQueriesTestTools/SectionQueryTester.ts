import { QuerierSectionBase } from "../../../client/src/modules/FeStore/QuerierFeStore/QuerierSectionBase";
import { ApiQueries } from "../../../client/src/sharedWithServer/ApiQueries";
import {
  DbPackInfoSectionReq,
  makeReq,
  SectionPackReq,
} from "../../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { GetterListProps } from "../../../client/src/sharedWithServer/StateGetters/Bases/GetterListBase";
import { GetterSectionProps } from "../../../client/src/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSectionsBase } from "../../../client/src/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterList } from "../../../client/src/sharedWithServer/StateGetters/GetterList";
import { PackMakerSection } from "../../../client/src/sharedWithServer/StateOperators/Packers/PackMakerSection";
import { SolverSection } from "../../../client/src/sharedWithServer/StateOperators/Solvers/SolverSection";
import { SolverSections } from "../../../client/src/sharedWithServer/StateOperators/Solvers/SolverSections";
import { UpdaterSection } from "../../../client/src/sharedWithServer/StateOperators/Updaters/UpdaterSection";
import { StoreName } from "../../../client/src/sharedWithServer/stateSchemas/schema6SectionChildren/sectionStores";
import { SectionNameByType } from "../../../client/src/sharedWithServer/stateSchemas/SectionNameByType";

export function makeLastSectionProps<SN extends SectionNameByType>(
  props: GetterListProps<SN>
): GetterSectionProps<SN> {
  const list = new GetterList(props);
  const { feInfo } = list.last;
  return {
    ...props,
    ...feInfo,
  };
}

interface InitProps<SN extends SectionNameByType<"hasIndexStore">> {
  sectionName: SN;
}

export class SectionQueryTester<
  SN extends SectionNameByType<"hasIndexStore">
> extends QuerierSectionBase<SN> {
  get packMaker() {
    return new PackMakerSection(this.getterSectionBase.getterSectionProps);
  }
  get updater() {
    return new UpdaterSection(this.sectionActorBaseProps);
  }
  get solver() {
    return SolverSection.init(this.sectionActorBaseProps);
  }
  get mainStoreName(): StoreName<SN> {
    return this.get.mainStoreName as StoreName<SN>;
  }
  static init<S extends SectionNameByType<"hasIndexStore">>({
    sectionName,
  }: InitProps<S>): SectionQueryTester<S> {
    return new SectionQueryTester({
      apiQueries: {} as ApiQueries,
      ...makeLastSectionProps({
        sectionName,
        ...GetterSectionsBase.initProps({
          sections: SolverSections.initSectionsFromDefaultMain(),
        }),
      }),
    });
  }
  makeSectionPackReq(): SectionPackReq<any> {
    return makeReq({
      dbStoreName: this.mainStoreName,
      sectionPack: this.packMaker.makeSectionPack(),
    }) as SectionPackReq<any>;
  }
  makeDbInfoReq(): DbPackInfoSectionReq<any> {
    return makeReq({
      dbStoreName: this.mainStoreName,
      dbId: this.get.dbId,
    });
  }
}
