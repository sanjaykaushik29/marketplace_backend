import { auth } from "../api/services/auth.services";

const express = require('express');
const collectionRouter = express.Router();
const userController = require('../api/controller/CollectionController/collection.controller.ts')

// create collection 
collectionRouter.post(
    "/create-collection",
    auth, 
    userController.createCollection
  );

// get collection 
collectionRouter.post(
    "/collection",
    auth, 
    userController.getCollection
  );


module.exports = collectionRouter;