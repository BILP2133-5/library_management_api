import { Request, Response } from 'express';
import * as logService from '../services/log.service';

export async function listLogs(req: Request, res: Response): Promise<void> {
    try {
        const logs = await logService.listLogs();
        return void res.json(logs);
    } catch (error) {
        if (error instanceof Error) {
            return void res.json({ error: error.message });
        }

        return void res.json({ error: 'Internal server error' });
    }
}