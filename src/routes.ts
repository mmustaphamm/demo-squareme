import { Router, Request, Response, NextFunction } from "express";
import Constant from "./constant";
import { AppDataSource} from "./data-source";
import { UserController } from "./module/user/user.controller";
import { validateBvn } from "./middleware/validate.input";

// Async wrapper for routes
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const router = Router();


router.get("/test", (req: Request, res: Response) => {
  res.status(Constant.statusCode.OK).json({
    success: true,
    message: Constant.messages.apiHealth,
    data: { code: Constant.statusCode.OK },
  });
});

// User routes
router.post("/user/create", validateBvn, asyncHandler(UserController.createUser)); // Create user and send OTP
router.post("/user/verify-otp", asyncHandler(UserController.verifyOtp)); // Verify OTP
router.post("/user/set-pin", asyncHandler(UserController.setSecurityPin)); // Set security PIN
router.post("/user/verify-pin", asyncHandler(UserController.verifySecurityPin)); // Verify security PIN

export default router
