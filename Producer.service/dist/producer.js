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
exports.Producer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = require("./config");
class Producer {
    constructor() {
        this.channel = null;
    }
    createChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield amqplib_1.default.connect(config_1.rabbitMQ.url);
            this.channel = yield connection.createChannel();
        });
    }
    publishMessage(routingKey, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                yield this.createChannel();
            }
            if (this.channel) {
                const exchangeName = config_1.rabbitMQ.exchangeName;
                yield this.channel.assertExchange(exchangeName, 'direct');
                const logDetails = {
                    logType: routingKey,
                    message: message,
                    dateTime: new Date(),
                };
                yield this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(logDetails)));
                console.log(`The new ${routingKey} log is sent to exchange ${exchangeName}`);
            }
            else {
                console.error('Failed to create a channel');
            }
        });
    }
}
exports.Producer = Producer;
