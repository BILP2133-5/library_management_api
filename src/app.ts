import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

import authRouter from './routes/auth.routes';
import bookRouter from './routes/book.routes';
import userRouter from  './routes/user.routes';
import logRouter from './routes/log.routes';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

app.use(bodyParser.json());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI as string;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
    console.log('[MongoDB] Connected.');
}).catch((err) => {
    console.log('[MongoDB] Connection Error: ', err);
});

app.use('/auth', authRouter); // Auth Route
app.use('/books', bookRouter); // Book Route
app.use('/users', userRouter); // User Route
app.use('/logs',logRouter); // Logs Route
  
app.get('/', (req: Request, res: Response) => {
  res.send('Library API');
});

app.listen(port, () => {
  console.log(`Server works on ${port} PORT`);
});
