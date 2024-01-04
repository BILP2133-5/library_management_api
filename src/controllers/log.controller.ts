import { Request, Response } from 'express';
import * as logService from '../services/log.service';

export async function listLogs(req: Request, res: Response): Promise<void> {
    try {
        const logs = await logService.listLogs();
        res.json(logs);
    } catch (error) {
        if (error instanceof Error) {
            res.sendStatus(500).json({ error: error.message });
        }

        res.sendStatus(500).json({ error: 'Internal server error' });
    }
}