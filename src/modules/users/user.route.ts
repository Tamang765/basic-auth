import { Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserModule } from "./interfaces/user.module.js";
import { forgotPasswordSchema } from "./validation/forgot-password.schema.js";
import { loginSchema } from "./validation/login.schema.js";
import { userSchema } from "./validation/user.schema.js";

const router = Router();

router.post("/register", validate(userSchema), UserModule.controller.register);
router.post("/login", validate(loginSchema), UserModule.controller.login);
router.get("/me", authMiddleware, UserModule.controller.getMe);
router.post("/refresh", authMiddleware, UserModule.controller.refresh);
router.post(`/verify/:id`, authMiddleware, UserModule.controller.verify);
router.post(`/resend-verification`, UserModule.controller.resend);
router.post(
  `/forgot-password`,
  validate(forgotPasswordSchema),
  UserModule.controller.reset,
);

export default router;
