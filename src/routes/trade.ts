import { auth } from "../api/services/auth.services";

const express = require('express');
const tradesRouter = express.Router();
const tradeController = require('../api/controller/TradeController/tradecontroller.ts')

// get collection 
tradesRouter.get(
    "/trade",
    auth,
    tradeController.getTrades
  );

module.exports = tradesRouter;