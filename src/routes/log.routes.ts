import express from 'express';
import * as logController from '../controllers/log.controller';

const logRouter = express.Router();

logRouter.get('/', logController.listLogs);

export default logRouter;