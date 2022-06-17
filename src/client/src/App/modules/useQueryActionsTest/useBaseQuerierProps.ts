import { StateQuerierBaseProps } from "../QueriersRelative/StateQuerierBase";
import { useAnalyzerContext } from "../usePropertyAnalyzer";

export function useStateQuerierBaseProps(): StateQuerierBaseProps {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  return {
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
  };
}
