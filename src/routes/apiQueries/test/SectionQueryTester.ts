import { IndexSectionQuerierBase } from "../../../client/src/App/modules/QueriersBasic/Bases/IndexSectionQuerierBase";
import { ApiQueries } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  DbPackInfoReq,
  makeReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { DbSectionNameName } from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import { SectionName } from "../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { GetterListProps } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterListBase";
import { GetterSectionProps } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterList } from "../../../client/src/App/sharedWithServer/StateGetters/GetterList";
import { GetterSection } from "../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../../client/src/App/sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSections } from "../../../client/src/App/sharedWithServer/StateSolvers/SolverSections";
import { UpdaterSection } from "../../../client/src/App/sharedWithServer/StateUpdaters/UpdaterSection";

export function makeLastSectionProps<SN extends SectionName>(
  props: GetterListProps<SN>
): GetterSectionProps<SN> {
  const list = new GetterList(props);
  const { feInfo } = list.last;
  return {
    ...props,
    ...feInfo,
  };
}

interface InitProps<SN extends SectionName<"hasIndexStore">> {
  sectionName: SN;
}

export class SectionQueryTester<
  SN extends SectionName<"hasIndexStore">
> extends IndexSectionQuerierBase<SN> {
  get packMaker() {
    return new PackMakerSection(this.getterSectionBase.getterSectionProps);
  }
  get get() {
    return new GetterSection(this.indexSectionQuerierProps);
  }
  get updater() {
    return new UpdaterSection(this.indexSectionQuerierProps);
  }
  get dbStoreName(): DbSectionNameName<SN> {
    return this.get.meta.dbIndexStoreName as DbSectionNameName<SN>;
  }
  static init<S extends SectionName<"hasIndexStore">>({
    sectionName,
  }: InitProps<S>): SectionQueryTester<S> {
    return new SectionQueryTester({
      apiQueries: {} as ApiQueries,
      ...makeLastSectionProps({
        sectionName,
        sectionsShare: {
          sections: SolverSections.initSectionsFromDefaultMain(),
        },
      }),
    });
  }
  makeSectionPackReq(): SectionPackReq<DbSectionNameName<SN>> {
    return makeReq({
      dbStoreName: this.dbStoreName,
      sectionPack: this.packMaker.makeSectionPack(),
    }) as SectionPackReq<DbSectionNameName<SN>>;
  }
  makeDbInfoReq(): DbPackInfoReq<DbSectionNameName<SN>> {
    return makeReq({
      dbStoreName: this.dbStoreName,
      dbId: this.get.dbId,
    });
  }
}
