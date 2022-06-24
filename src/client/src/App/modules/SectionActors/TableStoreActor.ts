import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { SectionPackMaker } from "../../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { SectionActorBase } from "./SectionActorBase";
import { TableActor } from "./TableActor";

export class TableStoreActor<
  SN extends SectionName<"tableStore">
> extends SectionActorBase<SN> {
  get tableActor(): TableActor {
    return new TableActor({
      ...this.sectionActorBaseProps,
      sendTable: () => {},
    });
  }
  get tableSourceName() {
    return this.get.meta.tableSourceName;
  }
  get get() {
    return new GetterSection(this.sectionActorBaseProps);
  }
  // get querier() {
  //   return new SectionQuerier(this.sectionActorBaseProps);
  // }
  get packMaker() {
    return new SectionPackMaker(this.sectionActorBaseProps);
  }
  // makeSendTable() {
  //   return async () => {
  //     this.querier.update(
  //       this.packMaker.makeSectionPack() as any as ServerSectionPack
  //     );
  //   };
  // }
}
