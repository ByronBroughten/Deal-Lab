import React from "react";
import { config } from "../Constants";
import { NextRes } from "../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { DbStoreNameNext } from "../sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { applyMixins } from "../utils/classObjects";
import { makeContextUseContext } from "../utils/react";
import { auth } from "./services/authService";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { useAnalyzerContext } from "./usePropertyAnalyzer";
import { apiQueries } from "./useQueryActions/apiQueriesClient";

class AuthQueryActor extends StateQuerierBase {
  protected setLogin({ data, headers }: NextRes<"nextLogin">) {
    auth.setToken(headers[config.tokenKey.apiUserAuth]);
    this.setSectionsOrdered(this.sections.loadUserAndSolve(data));
  }
  async login() {
    const req = this.reqMaker.nextLogin();
    const res = await apiQueries.nextLogin(req);
    this.setLogin(res);
  }
  async register() {
    const req = this.reqMaker.nextRegister();
    const res = await apiQueries.nextRegister(req);
    this.setLogin(res);
  }
}
class SectionArrQueryActor extends StateQuerierBase {
  async replaceSectionArrNoRevert(sectionName: DbStoreNameNext<"arrStore">) {
    const reqObj = this.reqMaker.sectionPackArr(sectionName);
    await apiQueries.replaceSectionArr(reqObj);
  }
}

interface QueryActor
  extends StateQuerierBase,
    SectionArrQueryActor,
    AuthQueryActor {}
class QueryActor extends StateQuerierBase {
  constructor(props: StateQuerierBaseProps) {
    super(props);
  }
}
applyMixins(QueryActor, [
  StateQuerierBase,
  SectionArrQueryActor,
  AuthQueryActor,
]);

const [Context, useContext] = makeContextUseContext(
  "QueryActorContext",
  "any" as any as QueryActor
);
export const useQueryActorContext = useContext;
export function QueryActorProvider({ children }: { children: any }) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  const queryActor = new QueryActor({
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
  });
  return <Context.Provider value={queryActor}>{children}</Context.Provider>;
}
