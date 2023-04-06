import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import {
  ApiQuerierBase,
  ApiQuerierBaseProps,
} from "../QueriersBasic/Bases/ApiQuerierBase";

interface QuerierSectionsBaseProps
  extends ApiQuerierBaseProps,
    GetterSectionsProps {}

export class QuerierSectionsBase extends ApiQuerierBase {
  readonly getterSectionsBase: GetterSectionsBase;
  constructor(props: QuerierSectionsBaseProps) {
    super(props);
    this.getterSectionsBase = new GetterSectionsBase(props);
  }
  get getterSectionsProps(): GetterSectionsProps {
    return this.getterSectionsBase.getterSectionsProps;
  }
  get querierSectionsBaseProps(): QuerierSectionsBaseProps {
    return {
      ...this.getterSectionsProps,
      apiQueries: this.apiQueries,
    };
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
}
