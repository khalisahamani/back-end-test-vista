import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { CreateServiceDto } from "../types";
import { validateCreateService, validateIdParam } from "../middleware/validators";


const router = Router();

// POST /services
router.post(
  "/",
  validateCreateService,
  async (req: Request<{}, {}, CreateServiceDto>, res: Response, next: NextFunction) => {
    try {
      const { companyId, name, description, price } = req.body;

      if (!name?.trim() || !description?.trim()) {
        res.status(400).json({ error: "name and description are required" });
        return;
      }
      if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
        res.status(400).json({ error: "price must be a non-negative number" });
        return;
      }
      if (!Number.isInteger(companyId)) {
        res.status(400).json({ error: "companyId must be an integer" });
        return;
      }

      const company = await prisma.company.findUnique({ where: { id: companyId } });
      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      const service = await prisma.service.create({
        data: { companyId, name: name.trim(), description: description.trim(), price },
      });
      res.status(201).json(service);
    } catch (err) {
      next(err);
    }
  }
);

// GET /services/:id
router.get("/:id", validateIdParam, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "id must be an integer" });
      return;
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: { company: true },
    });
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json(service);
  } catch (err) {
    next(err);
  }
});

export default router;