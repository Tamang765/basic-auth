import type { Request, Response } from "express";
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

  login = async (req: Request, res: Response) => {
    const response = await this.userService.login(req.body);

    return res.status(200).json({
      status: true,
      data: response,
    });
  };

  getMe = async (req: Request, res: Response) => {
    return res.status(200).json({
      status: true,
      data: req.user,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const response = await this.userService.refreshToken(refreshToken);
    return res.status(200).json({
      status: true,
      data: response,
    });
  };
}
