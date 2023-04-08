import { DbAction } from "../../sharedWithServer/apiQueriesShared/DbAction";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
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
    return Obj.keys(changesSaving).map((storeId) => {
      const { storeName } = StoreId.split(storeId);
      const change = changesSaving[storeId];
      return {
        ...change,
        storeName,
      } as DbAction;
    });
  }
  async trySave(): Promise<boolean> {
    const { data } = await this.apiQueries.updateSections(
      makeReq({ changes: this.getDbChangeNodes() })
    );
    if (data.success) {
      return true;
    } else {
      return false;
    }
  }
}
