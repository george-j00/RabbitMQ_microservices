
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { WarningError } from './warningErrorConsumer';

const warningError = new WarningError();

const app : Express  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/getWarning", async (req : Request, res : Response, next) => {
 const response =  await warningError.consumeMessages();
  res.send(response);
});

app.listen(3003, () => {
  console.log(`warning and error Consumer Server started on port ${3003}`);
});