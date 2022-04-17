import { Response } from "supertest";

export function getResData(res: Response) {
  return JSON.parse(res.text);
}
