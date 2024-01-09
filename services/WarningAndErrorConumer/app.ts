
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { WarningError } from './warningErrorConsumer';

const warningError = new WarningError();

const app : Express  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/sendLog", async (req : Request, res : Response, next) => {
  await warningError.consumeMessages();
  res.send();
});

app.listen(3002, () => {
  console.log(`Info Consumer Server started on port ${3002}`);
});