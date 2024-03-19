import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import Replicate from "replicate";
import fetch from "cross-fetch";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

import { SocketModeClient } from '@slack/socket-mode';
import { WebClient } from '@slack/web-api';

const appToken = process.env.SLACK_APP_TOKEN; 
const botToken = process.env.SLACK_BOT_TOKEN; 

const socketModeClient = new SocketModeClient({ appToken });
const webClient = new WebClient(botToken);

async function generateImageWithReplicate(commandText) {
  const replicate = new Replicate({
    auth: "r8_Z8w5DcDwDaL7APCNGLOYR5GFCtpHNYD1kblRj", // defaults to process.env.REPLICATE_API_TOKEN
    fetch: fetch,
  });
  const model =
    "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478";
  const input = {
    prompt: commandText,
  };
  const output = await replicate.run(model, { input });
  console.log("output", output)
  return 
}

socketModeClient.on('slash_commands', async ({ body, ack }) => {
  await ack();
  console.log("body", body)
  const commandText = body.text; 
  const channelId = body.channel_id; 
  console.log("channelId", channelId)
  try {
    // const imageUrl:any = await generateImageWithReplicate(commandText);


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
    }
    );
  } catch (error) {
    console.error('Error processing slash command:', error);
  }
});

// Khởi động Socket Mode client
(async () => {
  await socketModeClient.start();
  console.log('Your bot is running in Socket Mode');
})();

bootstrap();
