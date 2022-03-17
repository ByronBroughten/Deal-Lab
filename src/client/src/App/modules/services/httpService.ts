import axios, { AxiosResponse } from "axios"; // npm i axios
import { toast } from "react-toastify";
import logger from "./logService";
import { auth } from "./authService";
import { authTokenKey } from "../../sharedWithServer/User/crudTypes";

axios.interceptors.request.use(function (config) {
  if (config.headers && config.headers.common) {
    config.headers = {
      ...config.headers,
      [authTokenKey]: auth.getToken() ?? false,
    };
    // config.headers.common = {
    //   ...config.headers.common,
    //   [authTokenKey]: auth.getToken(),
    // };
  }

  return config;
});

function errorIsExpected(error: any) {
  return (
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500
  );
}

function handleUnexpectedError(error: any, blanking: string) {
  logger.log(error);
  toast.error(`An unexpected error occurred while ${blanking}.`);
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
    return undefined;
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
