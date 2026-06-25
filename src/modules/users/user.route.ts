import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { UserModule } from "./interfaces/user.module.js";
import { loginSchema } from "./validation/login.schema.js";
import { userSchema } from "./validation/user.schema.js";

const router = Router();

router.post("/register", validate(userSchema), UserModule.controller.register);
router.post("/login", validate(loginSchema), UserModule.controller.login);

export default router;
