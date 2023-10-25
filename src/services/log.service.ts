import LogModel,{ ILog } from '../models/log.model';
import { Types } from 'mongoose';

export async function logActivity(userId: Types.ObjectId, activity: string, details: string): Promise<void> {

    const uniqueKey = `${userId}-${activity}`;
    const existingLog = await LogModel.findOne({ uniqueKey });

    if (existingLog) {
        console.log("The log already exists");
        return;
    }

    const log = new LogModel({
        userId,
        activity,
        details,
    });

    await log.save();
}

export async function listLogs(): Promise<ILog[]> {
    return LogModel.find().exec();
}
