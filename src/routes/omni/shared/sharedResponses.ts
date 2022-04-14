import { Response } from "express";

export const sharedResponses = {
  success(
    res: Response,
    { data, headers }: { data: any; headers?: { [key: string]: string } }
  ) {
    res.header(headers).status(200).send(data);
  },
  falsyQuery(res: Response, queryName: string = "query") {
    res.status(404).send(`${queryName} returned falsy`);
  },
  resDataIsInvalid(res: Response, whatInvalid: string) {
    res.status(500).send(`Valid ${whatInvalid} not provided for response data`);
  },
};
