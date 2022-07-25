import { userAuthWare } from "../../middleware/authWare";

export const updateLoginWare = [userAuthWare, updateLogin];
async function updateLogin(req: Request, res: Response) {}
