
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Producer } from './producer';

const producer = new Producer();

const app : Express  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/sendLog", async (req : Request, res : Response, next) => {
  await producer.publishMessage(req.body.logType, req.body.message);
  // console.log(req.body);
  
  res.send();
});

app.listen(3000, () => {
  console.log("Server started...");
});