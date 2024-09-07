import axios, { AxiosResponse } from "axios"; // npm i axios
import { toast } from "react-toastify";
import Session from "supertokens-auth-react/recipe/session";
import { constants } from "../../sharedWithServer/Constants";
import logger from "./logService";
import { userTokenS } from "./userTokenS";

axios.interceptors.request.use(function (config) {
  if (config.headers && config.headers.common) {
    config.headers = {
      ...config.headers,
      [constants.tokenKey.userAuthData]: userTokenS.userToken ?? false,
    };
  }

  return config;
});

Session.addAxiosInterceptors(axios);

function errorIsExpected(error: any) {
  return (
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500
  );
}

export function handleUnexpectedError(error: any, blanking?: string) {
  logger.log(error);
  toast.error(
    `An unexpected error occurred${blanking ? ` while ${blanking}` : ""}.`
  );
}

function handleServerError(error: any, blanking: string) {
  if (errorIsExpected(error)) {
    toast.error(error.response.data);
  } else {
    handleUnexpectedError(error, blanking);
  }
}

export type AsyncAxiosRes = Promise<AxiosResponse<unknown> | undefined>;
async function tryPost(
  blanking: string,
  url: string,
  body: any
): AsyncAxiosRes {
  try {
    const result = await axios.post(url, body);
    return result;
  } catch (err) {
    handleServerError(err, `${blanking}`);
  }
}

async function tryPut(blanking: string, url: string, body: any): AsyncAxiosRes {
  try {
    return await axios.put(url, body);
  } catch (err) {
    handleServerError(err, blanking);
    return undefined;
  }
}

async function tryGet(blanking: string, url: string): AsyncAxiosRes {
  try {
    return await axios.get(url);
  } catch (err) {
    handleServerError(err, blanking);
    return undefined;
  }
}

async function tryDelete(blanking: string, url: string): AsyncAxiosRes {
  try {
    return await axios.delete(url);
  } catch (err) {
    handleServerError(err, blanking);
    return undefined;
  }
}

const https = {
  get: tryGet,
  post: tryPost,
  put: tryPut,
  delete: tryDelete,
};
export default https;
