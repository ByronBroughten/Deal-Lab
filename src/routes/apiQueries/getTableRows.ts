import { Request, Response } from "express";
import { QueryReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { SectionPack } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackArrByType } from "../../client/src/App/sharedWithServer/SectionsMeta/SectionNameByType";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { Authed, validateAuthObj } from "./apiQueriesShared/ReqAugmenters";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateDbStoreName } from "./apiQueriesShared/validateDbSectionInfoReq";

export const getTableRowsWare = [getAuthWare(), getTableRows];

export async function getTableRows(req: Request, res: Response) {
  const { auth, ...rest } = validateGetTableRowsReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  const tableRowPacks = await dbUser.makeTableRows(rest);
  sendSuccess(res, "getTableRows", { data: { tableRowPacks } });
}
type TableRowsReq = Authed<QueryReq<"getTableRows">>;
function validateGetTableRowsReq(req: Authed<any>): TableRowsReq {
  const { auth, columns, dbStoreName } = (req as TableRowsReq).body;
  return {
    body: {
      auth: validateAuthObj(auth),
      dbStoreName: validateDbStoreName(dbStoreName, "mainIndex"),
      columns: validateSectionPackArrByType({
        value: columns,
        sectionType: "column",
      }) as SectionPack<"column">[],
    },
  };
}
