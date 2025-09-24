import { Router, Response, Request } from "express";
import { checkToken } from "../middlewares/check-token.js";
import { getUncontactedUsersOf } from "../managers/users.manager.js";
import { ensureCurrentUser } from "../utils/require-current-user.js";

const conversationRouter = Router();

conversationRouter.get(
  "/uncontacted-users",
  checkToken,
  (req: Request, res: Response) => {
    const authReq = ensureCurrentUser(req);
    const users = getUncontactedUsersOf(authReq.currentUser.id);
    res.json(users);
  }
);

export default conversationRouter;
