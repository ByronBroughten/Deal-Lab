import { ApiQuerierBaseProps } from "../../modules/QueriersBasic/Bases/ApiQuerierBase";
import { apiQueries } from "../../modules/useQueryActions/apiQueriesClient";
import { SetterSectionsProps } from "../StateSetters/SetterBases/SetterSectionsBase";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

interface SectionsActorProps extends SetterSectionsProps, ApiQuerierBaseProps {}
export function useSectionsActorProps(): SectionsActorProps {
  const props = useSetterSectionsProps();
  return {
    ...props,
    apiQueries: apiQueries,
  };
}
