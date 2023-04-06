import { DbAction } from "../../sharedWithServer/apiQueriesShared/DbAction";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { StoreName } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import {
  QuerierSectionBase,
  QuerierSectionBaseProps,
} from "./../SectionActors/QuerierSectionBase";
import { GetterFeStore } from "./GetterFeStore";

interface Props
  extends StrictOmit<
    QuerierSectionBaseProps<"feStore">,
    "sectionName" | "feId"
  > {}

export class QuerierFeStore extends QuerierSectionBase<"feStore"> {
  constructor(props: Props) {
    super({
      ...props.sectionsShare.sections.onlyOneRawSection("feStore"),
      ...props,
    });
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionBase.getterSectionsProps);
  }
  get getterFeStore(): GetterFeStore {
    return new GetterFeStore(this.getterSectionBase.getterSectionsProps);
  }
  getDbChangeNodes(): DbAction[] {
    const changesSaving = this.get.valueNext("changesSaving");
    return Obj.keys(changesSaving).map((sectionId) => {
      const section = this.getterSections.sectionBySectionId(sectionId);
      const change = changesSaving[sectionId];
      return {
        ...change,
        storeName: section.selfChildName as StoreName,
      } as DbAction;
    });
  }
  async trySave() {
    try {
      const { data } = await this.apiQueries.updateSections(
        makeReq({ changes: this.getDbChangeNodes() })
      );
      if (data.success) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
