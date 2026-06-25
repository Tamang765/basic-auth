import type { Request, Response } from "express";
import { logger } from "../../utils/logger.js";
import type { UserService } from "./user.service.js";

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response) => {
    const response = await this.userService.register(req.body);

    return res.status(201).json({
      status: true,
      data: response,
    });
  };
}
