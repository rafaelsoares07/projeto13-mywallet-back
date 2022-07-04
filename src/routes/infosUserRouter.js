import validateUser from "../middlewares/validateUser.js"

import { getCashFlow, createMoneyOut, createMoneyIn } from "../controllers/infosUserController.js";
import { Router } from "express";

const router = Router()

router.get("/fluxoCaixa",validateUser, getCashFlow) // no meio tem que ter o midware que valide o token e diga o usuario qeu ta tentando pegar os dasos 

router.post("/novaSaida",validateUser, createMoneyOut)

router.post("/novaEntrada", validateUser, createMoneyIn)

export default router