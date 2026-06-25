import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { UserModule } from "./interfaces/user.module.js";
import { userSchema } from "./user.schema.js";

const router = Router();

router.post("/register", validate(userSchema), UserModule.controller.register);

export default router;
