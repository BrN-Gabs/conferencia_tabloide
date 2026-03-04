import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import { processarConferencia } from "../controllers/conferencia.controller.js";

const router = Router();

router.post(
  "/upload",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  processarConferencia
);

export default router;