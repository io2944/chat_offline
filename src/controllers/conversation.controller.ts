import { Router, Response, Request } from "express";
import { checkToken } from "../middlewares/check-token.js";
import { getUncontactedUsersOf } from "../managers/users.manager.js";
import { ensureCurrentUser } from "../utils/require-current-user.js";
import {
  createConversation,
  findAllUserConversations,
} from "../managers/conversations.manager.js";

const conversationRouter = Router();

conversationRouter.get(
  "/uncontacted-users",
  checkToken,
  (req: Request, res: Response) => {
    const authReq = ensureCurrentUser(req);
    const users = getUncontactedUsersOf(authReq.currentUser.id);
    res.status(200).json(users);
  }
);

conversationRouter.get(
  "/my-conversations",
  checkToken,
  (req: Request, res: Response) => {
    const authReq = ensureCurrentUser(req);
    return res
      .status(200)
      .json(findAllUserConversations(authReq.currentUser.id));
  }
);

conversationRouter.post("/", checkToken, (req: Request, res: Response) => {
  const { userId } = req.body;
  const authReq = ensureCurrentUser(req);
  const currentUserId = authReq.currentUser.id;

  if (!userId || userId === currentUserId) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const currentUserConversations = findAllUserConversations(
    currentUserId
  )?.filter((conv) => {
    !conv.isGroup;
  });
  const targetUserConversations = findAllUserConversations(userId)?.filter(
    (conv) => {
      !conv.isGroup;
    }
  );

  const currentIds = new Set(currentUserConversations?.map((c) => c.id));
  const targetIds = new Set(targetUserConversations?.map((c) => c.id));

  const sharedConversationId = [...currentIds].find((id) => targetIds.has(id));

  if (sharedConversationId) {
    return res.status(409).json({
      error: "Conversation already exists",
      conversationId: sharedConversationId,
    });
  }

  return res.status(201).json(createConversation([currentUserId, userId]));
});

export default conversationRouter;
