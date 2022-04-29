import Analyzer from "../sharedWithServer/Analyzer";
import { ReqMaker } from "../sharedWithServer/apiQueriesShared";
import { apiQueries } from "./useQueryActions/apiQueriesClient";

export interface StateQuerierBaseProps {
  sections: Analyzer;
  setSectionsOrdered: (sections: Analyzer) => void;
}
export class StateQuerierBase {
  protected nextSections: Analyzer;
  protected readonly sections: Analyzer;
  protected setSectionsOrdered: (sections: Analyzer) => void;
  constructor({ sections, setSectionsOrdered }: StateQuerierBaseProps) {
    this.sections = sections;
    this.nextSections = sections;
    this.setSectionsOrdered = setSectionsOrdered;
  }
  protected get nextBaseProps() {
    return {
      sections: this.nextSections,
      setSectionsOrdered: this.setSectionsOrdered,
    };
  }
  protected setOriginalSectionsAsState() {
    this.setSectionsOrdered(this.sections);
  }
  protected setNextSectionsAsState() {
    this.setSectionsOrdered(this.nextSections);
  }
  protected get reqMaker() {
    return new ReqMaker(this.nextSections);
  }
  protected get apiQuery() {
    return apiQueries;
  }
  protected async tryAndRevertIfFail(fn: () => void) {
    try {
      fn();
    } catch (err) {
      this.setOriginalSectionsAsState();
    }
  }
}
