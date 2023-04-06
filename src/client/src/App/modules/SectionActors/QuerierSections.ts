import { GetterSectionsProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { StateSections } from "../../sharedWithServer/StateSections/StateSections";
import { apiQueries } from "../apiQueriesClient";
import { QuerierFeStore } from "../FeStore/QuerierFeStore";
import { QuerierSectionsBase } from "./QuerierSectionsBase";

export class QuerierSections extends QuerierSectionsBase {
  static init(props: GetterSectionsProps): QuerierSections {
    return new QuerierSections({
      ...props,
      apiQueries: apiQueries,
    });
  }
  get feStore() {
    return new QuerierFeStore(this.querierSectionsBaseProps);
  }
  get stateSections(): StateSections {
    return this.getterSections.stateSections;
  }
}
