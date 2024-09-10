import urlJoin from "url-join";

function paramsToArr<
  PS extends { [key: string]: string },
  PN extends readonly (keyof PS)[]
>(params: PS, paramNames: PN): PS[keyof PS][] {
  return paramNames.map((paramName) => params[paramName]);
}

export function urlPlusParams<
  PS extends { [key: string]: string },
  PN extends readonly (keyof PS)[]
>(url: string, params: PS, orderedParamNames: PN) {
  const paramArr = paramsToArr(params, orderedParamNames);
  return urlJoin(url, ...paramArr);
}

export function paramNamesToRoute(paramNames: string[]) {
  let route = "";
  for (const paramName of paramNames) {
    route = route.concat(`/:${paramName}`);
  }
  return route;
}
export function paramNamesToPath(paramNames: string[]) {
  return urlJoin(...paramNames);
}
