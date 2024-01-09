"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
function consumeMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqplib_1.default.connect('amqp://localhost');
        const channel = yield connection.createChannel();
        yield channel.assertExchange('logExchange', 'direct');
        const q = yield channel.assertQueue('InfoQueue');
        yield channel.bindQueue(q.queue, 'logExchange', 'Info');
        channel.consume(q.queue, (msg) => {
            if (msg !== null && msg.content) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    console.log('Received message:', data);
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('Error parsing message content:', error);
                    console.log('Raw message content:', msg.content.toString());
                }
            }
        });
    });
}
consumeMessages()
    .then(() => {
    console.log('Consumer service started successfully.');
})
    .catch((err) => {
    console.error('Error starting consumer service:', err);
});
