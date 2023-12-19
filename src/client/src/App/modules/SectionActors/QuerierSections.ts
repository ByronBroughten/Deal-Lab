import { StateSections } from "../../../sharedWithServer/State/StateSections";
import { GetterSectionsProps } from "../../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";

import { QuerierFeStore } from "../FeStore/QuerierFeStore";
import { apiQueries } from "../apiQueriesClient";
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
