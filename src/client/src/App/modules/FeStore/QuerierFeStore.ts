import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
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
  get getterFeStore(): GetterFeStore {
    return new GetterFeStore(this.getterSectionBase.getterSectionsProps);
  }

  async trySaveAttempt(saveAttemptId: string) {
    const sectionPackArrs =
      this.getterFeStore.getSaveAttemptPacks(saveAttemptId);
    try {
      const { data } = await this.apiQueries.updateSections(
        makeReq({ sectionPackArrs })
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
