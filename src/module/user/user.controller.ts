import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./../../data-source";
import { UserData } from "./user.entity";
import bcrypt from "bcrypt"


export class UserController {
    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {

            const { phoneNumber } = req.body

            console.log(phoneNumber)
            // Get the repository
             const userRepository = AppDataSource.getRepository(UserData);

              // Check if user already exists
             let user = await userRepository.findOneBy({ phoneNumber });
            if (!user) {
             // Create a new user if not found
            user = userRepository.create({ phoneNumber });
            await userRepository.save(user);
             }

              // Generate and save a hardcoded OTP
              const otp = "12345"; // Hardcoded OTP for test environment
              user.otp = otp;
               user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
              await userRepository.save(user);

              // Respond with success message
             return res.status(200).json({
              success: true,
              message: "OTP sent to phone number",
              }); 


        } catch (error) {
           console.log(error) 
           return res.status(500).json({ success: false, message: "An error occurred"})
        }
    }
    static async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { phoneNumber, otp } = req.body;
    
            // Validate input
            if (!phoneNumber || !otp) {
                return res.status(400).json({ message: "Phone number and OTP are required" });
            }

            if (otp.length !== 5) {
                return res.status(400).json({ message: "otp must have a length of 5"})
            }
    
            // Get the repository
            const userRepository = AppDataSource.getRepository(UserData);
    
            // Find user by phone number
            const user = await userRepository.findOneBy({ phoneNumber });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if OTP matches and is not expired
            if (user.otp !== otp ) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
    
            // OTP is valid - clear the OTP and mark the user as verified
            user.otp = null;
            user.otpExpiresAt = null;
            await userRepository.save(user);
    
            return res.status(200).json({
                success: true,
                message: "OTP verified successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "An error occurred" });
        }
    }

    static async setSecurityPin(req: Request, res: Response, next: NextFunction) {
        try {
            const { phoneNumber, pin } = req.body;
    
            // Validate input
            if (!phoneNumber || !pin) {
                return res.status(400).json({ message: "Phone number and PIN are required" });
            }
    
            if (!/^\d{6}$/.test(pin)) {
                return res.status(400).json({ message: "PIN must be a 6-digit number" });
            }
    
            // Get the repository
            const userRepository = AppDataSource.getRepository(UserData);
    
            // Find user by phone number
            const user = await userRepository.findOneBy({ phoneNumber });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const saltRounds = 10;
            const hashedPin = await bcrypt.hash(pin, saltRounds);
    
            user.securityPin = hashedPin;
            await userRepository.save(user);
    
            return res.status(200).json({
                success: true,
                message: "Security PIN set successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "An error occurred" });
        }
    }

    static async verifySecurityPin(req: Request, res: Response, next: NextFunction) {
        try {
            const { phoneNumber, pin } = req.body;
    
            // Validate input
            if (!phoneNumber || !pin) {
                return res.status(400).json({ message: "Phone number and PIN are required" });
            }
    
            // Get the repository
            const userRepository = AppDataSource.getRepository(UserData);
    
            // Find user by phone number
            const user = await userRepository.findOneBy({ phoneNumber });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            if (!user.securityPin) {
                return res.status(400).json({ message: "Security PIN is not set" });
            }
    
            // Compare the hashed PIN
            const bcrypt = require("bcrypt");
            const isMatch = await bcrypt.compare(pin, user.securityPin);
    
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid PIN" });
            }
    
            return res.status(200).json({
                success: true,
                message: "PIN verified successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "An error occurred" });
        }
    }
    
    
    
}