import { ApiQuerierProps } from "../../modules/QueriersBasic/ApiQuerierNext";
import { apiQueries } from "../../modules/useQueryActions/apiQueriesClient";
import { SetterSectionsProps } from "../StateSetters/SetterBases/SetterSectionsBase";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

interface SectionsActorProps extends SetterSectionsProps, ApiQuerierProps {}
export function useSectionsActorProps(): SectionsActorProps {
  const props = useSetterSectionsProps();
  return {
    ...props,
    apiQueries: apiQueries,
  };
}
