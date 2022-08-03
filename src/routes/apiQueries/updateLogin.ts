import { checkLoginWare } from "../../middleware/authWare";

export const updateLoginWare = [checkLoginWare, updateLogin];
async function updateLogin(req: Request, res: Response) {}
