import {Router} from 'express';
import {RequestHandler} from '../controller/request-handler.js';
const requestHandler = new RequestHandler();

export const router = Router();

router.get('/', (req, res) => requestHandler.getHomepage(req,res));

router.post('/search', (req, res) => requestHandler.findDocuments(req,res));  

router.get('*', (req, res) => requestHandler.redirectToHomepage(req, res));
