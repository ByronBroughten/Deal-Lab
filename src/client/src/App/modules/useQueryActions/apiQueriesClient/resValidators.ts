import { AxiosResponse } from "axios";
import { Id } from "../../../sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import { QueryError } from "../../../sharedWithServer/apiQueriesShared";

function dbIdResValidator(res: AxiosResponse<unknown>): { data: { dbId: string } } {
  if (Id.is(res.data))
    return {
      data: {
        dbId: res.data
      },
    };
  else throw makeResValidationQueryError();
}

function serverSectionPackResValidator(res: AxiosResponse<unknown>): { data: { rawServerSectionPack:  } }

function makeResValidationQueryError() {
  return new QueryError("Response failed validation.");
}