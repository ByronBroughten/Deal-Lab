import { IndexSectionQuerierBase } from "../../../client/src/App/modules/QueriersRelative/Bases.ts/IndexSectionQuerierBase";
import { IndexSectionQuerier } from "../../../client/src/App/modules/QueriersRelative/IndexSectionQuerier";
import { ApiQueries } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  DbSectionPackInfoReq,
  makeReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionName } from "../../../client/src/App/sharedWithServer/SectionsMeta/SectionName";
import { GetterListProps } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterListBase";
import { GetterSectionProps } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterList } from "../../../client/src/App/sharedWithServer/StateGetters/GetterList";
import { GetterSection } from "../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
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
  indexName: SectionName<"indexStore">;
}
export class SectionQueryTester<
  SN extends SectionName<"hasIndexStore">
> extends IndexSectionQuerierBase<SN> {
  querier = new IndexSectionQuerier(this.indexSectionQuerierProps);
  get get() {
    return new GetterSection(this.indexSectionQuerierProps);
  }
  get updater() {
    return new UpdaterSection(this.indexSectionQuerierProps);
  }
  static init<S extends SectionName<"hasIndexStore">>({
    sectionName,
    indexName,
  }: InitProps<S>): SectionQueryTester<S> {
    return new SectionQueryTester({
      apiQueries: {} as ApiQueries,
      indexName,
      ...makeLastSectionProps({
        sectionName,
        sectionsShare: {
          sections: SolverSections.initSectionsFromDefaultMain(),
        },
      }),
    });
  }
  makeSectionPackReq(): SectionPackReq {
    return makeReq({ sectionPack: this.querier.makeIndexSectionPack() });
  }
  makeDbInfoReq(): DbSectionPackInfoReq {
    return makeReq({
      dbStoreName: this.indexName,
      dbId: this.get.dbId,
    });
  }
}
