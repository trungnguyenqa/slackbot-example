"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const replicate_1 = __importDefault(require("replicate"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
}
const socket_mode_1 = require("@slack/socket-mode");
const web_api_1 = require("@slack/web-api");
const appToken = process.env.SLACK_APP_TOKEN;
const botToken = process.env.SLACK_BOT_TOKEN;
const socketModeClient = new socket_mode_1.SocketModeClient({ appToken });
const webClient = new web_api_1.WebClient(botToken);
async function generateImageWithReplicate(commandText) {
    const replicate = new replicate_1.default({
        auth: "r8_Z8w5DcDwDaL7APCNGLOYR5GFCtpHNYD1kblRj",
        fetch: cross_fetch_1.default,
    });
    const model = "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478";
    const input = {
        prompt: commandText,
    };
    const output = await replicate.run(model, { input });
    console.log("output", output);
    return;
}
socketModeClient.on('slash_commands', async ({ body, ack }) => {
    await ack();
    console.log("body", body);
    const commandText = body.text;
    const channelId = body.channel_id;
    console.log("channelId", channelId);
    try {
        await webClient.chat.postMessage({
            "channel": `${channelId}`,
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Danny Torrence left the following review for your property:"
                    }
                },
                {
                    "type": "section",
                    "block_id": "section567",
                    "text": {
                        "type": "mrkdwn",
                        "text": "<https://example.com|Overlook Test> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-6/387199384_3669333883286492_9124676622576540462_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=F6TBbdcglEgAX-x-p_h&_nc_ht=scontent.fhan5-6.fna&oh=00_AfDNmB7Xq2rcPh2WAy6z-UydIWeHL6Ka9zu9yMXn1Ao0mg&oe=65ECCAE8",
                        "alt_text": "Tesst"
                    },
                },
                {
                    "type": "section",
                    "block_id": "section789",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Average Rating*\n1.0"
                        }
                    ]
                }
            ],
            "attachments": [
                {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "*Alternative hotel options*"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "<https://example.com|Bates Motel> :star::star:"
                            },
                            "accessory": {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View",
                                    "emoji": true
                                },
                                "value": "view_alternate_1"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "<https://example.com|The Great Northern Hotel> :star::star::star::star:"
                            },
                            "accessory": {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View",
                                    "emoji": true
                                },
                                "value": "view_alternate_2"
                            }
                        }
                    ]
                }
            ]
        });
    }
    catch (error) {
        console.error('Error processing slash command:', error);
    }
});
(async () => {
    await socketModeClient.start();
    console.log('Your bot is running in Socket Mode');
})();
bootstrap();
//# sourceMappingURL=main.js.map