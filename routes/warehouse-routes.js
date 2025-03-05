import express from "express";
import * as userController from "../controllers/user-controller.js";

const router = express.Router();

router
  .route("/")
  .get(userController.index)
  .post(userController.add)
  .delete(userController.remove);
router.route("/:id").get(userController.findOne).patch(userController.update);
router.route("/:id/posts").get(userController.posts);

export default router;
