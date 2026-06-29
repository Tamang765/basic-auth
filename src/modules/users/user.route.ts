import { Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { authLimiter } from "../../middleware/rate-limiter.js";
import { validate } from "../../middleware/validate.js";
import { UserModule } from "./interfaces/user.module.js";
import { changePasswordSchema } from "./validation/change-password.schema.js";
import { forgotPasswordSchema } from "./validation/forgot-password.schema.js";
import { loginSchema } from "./validation/login.schema.js";
import { userSchema } from "./validation/user.schema.js";

const router = Router();

router.post("/register", validate(userSchema), UserModule.controller.register);
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  UserModule.controller.login,
);
router.get("/me", authMiddleware, UserModule.controller.getMe);
router.post("/refresh", UserModule.controller.refresh);
router.post(`/verify/:id`, authMiddleware, UserModule.controller.verify);
router.post(`/resend-verification`, UserModule.controller.resend);
router.post(
  `/reset-password`,
  validate(forgotPasswordSchema),
  UserModule.controller.reset,
);

router.post(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  UserModule.controller.changePassword,
);

export default router;
