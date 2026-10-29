import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { CreateCompanyDto } from "../types";
import { validateCreateCompany } from "../middleware/validators";

const router = Router();

// POST /companies
router.post(
  "/",
  validateCreateCompany,
  async (req: Request<{}, {}, CreateCompanyDto>, res: Response, next: NextFunction) => {
    try {
      const { name, registrationNumber } = req.body;
      if (!name?.trim() || !registrationNumber?.trim()) {
        res.status(400).json({ error: "name and registrationNumber are required" });
        return;
      }
      const company = await prisma.company.create({
        data: { name: name.trim(), registrationNumber: registrationNumber.trim() },
      });
      res.status(201).json(company);
    } catch (err: any) {
      if (err.code === "P2002") {
        res.status(409).json({ error: "registrationNumber already exists" });
        return;
      }
      next(err);
    }
  }
);

// GET /companies
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await prisma.company.findMany({ include: { services: true } });
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

export default router;