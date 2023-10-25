import { Schema, model, Document, Types } from 'mongoose';

export interface ILog extends Document {
  userId: Types.ObjectId;
  activity: string;
  details?: string;
  timestamp: Date;
}

const logSchema = new Schema<ILog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    details: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'logs', 
  }
);

export default model<ILog>('Log', logSchema);
