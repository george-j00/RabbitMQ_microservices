
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { InfoConsumer } from './infoConsumer';

const infoConsumer = new InfoConsumer();

const app : Express  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/sendLog", async (req : Request, res : Response, next) => {
  await infoConsumer.consumeMessages(); 
  res.send();
});

app.listen(3002, () => {
  console.log(`Info Consumer Server started on port ${3002}`);
});