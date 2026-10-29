import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Runs after the rules below: if any rule failed, reply 400 and stop
export function handleValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array().map((e) => ({
        field: e.type === "field" ? e.path : undefined,
        message: e.msg,
      })),
    });
    return;
  }
  next();
}

export const validateCreateCompany = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("registrationNumber").trim().notEmpty().withMessage("registrationNumber is required"),
  handleValidation,
];

export const validateCreateService = [
  body("companyId").isInt({ min: 1 }).withMessage("companyId must be a positive integer").toInt(),
  body("name").trim().notEmpty().withMessage("name is required"),
  body("description").trim().notEmpty().withMessage("description is required"),
  body("price").isFloat({ min: 0 }).withMessage("price must be a non-negative number").toFloat(),
  handleValidation,
];

export const validateIdParam = [
  param("id").isInt({ min: 1 }).withMessage("id must be a positive integer"),
  handleValidation,
];