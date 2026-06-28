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

  verify = async (req: Request, res: Response) => {
    const token = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const response = await this.userService.verifyEmail(token);

    return res.status(200).json({
      status: true,
      data: response,
    });
  };

  resend = async (req: Request, res: Response) => {
    await this.userService.resendVerification(req.body.email);
    return res.status(200).json({
      status: true,
    });
  };

  reset = async (req: Request, res: Response) => {
    const response = await this.userService.forgotPassword(req.body.email);
    return res.status(200).json({
      status: true,
      data: response,
    });
  };

  changePassword = async (req: Request, res: Response) => {
    const { userId, sessionId } = req.user;
    const { oldPassword, newPassword } = req.body;
    const response = await this.userService.changePassword(
      userId,
      sessionId,
      oldPassword,
      newPassword,
    );
    return res.status(200).json({
      status: true,
      data: response,
    });
  };
}
