import Analyzer from "../../sharedWithServer/Analyzer";
import { ReqMaker } from "../../sharedWithServer/apiQueriesShared";
import { apiQueries } from "../useQueryActions/apiQueriesClient";

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
  protected async tryAndRevertIfFail<FN extends () => any>(
    fn: FN
  ): Promise<ReturnType<FN>> {
    try {
      return fn();
    } catch (err) {
      this.setOriginalSectionsAsState();
      throw err;
    }
  }
}

// async function queryAndRevertSetIfFail<
//     Action extends keyof typeof sectionQueries,
//     Args extends Parameters<typeof sectionQueries[Action]>
//   >(action: Action, ...args: Args) {
//     const fn: (
//       this: typeof sectionQueries,
//       ...args: any
//     ) => Promise<{ data: any } | undefined> = sectionQueries[action];
//     const didSucceed = await fn.apply(sectionQueries, args);
//     if (!didSucceed) setAnalyzerToDefault();
//   }
