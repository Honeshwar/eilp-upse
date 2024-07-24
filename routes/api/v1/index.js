import { Router } from "express";
import { ApplicationController } from "../../../controllers/application_controller.js";
const router = Router();

router.post("/entry", ApplicationController);

export default router;
