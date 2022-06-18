import { useAnalyzerContext } from "../components/usePropertyAnalyzer";
import { StateQuerierBaseProps } from "./StateQuerierBase";

export function useStateQuerierBaseProps(): StateQuerierBaseProps {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  return {
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
  };
}
