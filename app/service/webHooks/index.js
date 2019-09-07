const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sign = (data, secret) => {
  return (
    "sha1=" +
    crypto.createHmac("sha1", secret)
      .update(data)
      .digest("hex")
  );
}

module.exports = async (ctx, next) => {
  const result = Buffer.from(ctx.request.header['x-hub-signature']).equals(Buffer.from(sign(ctx.request.body.valueOf(), "123456")))
  console.log('\n\n\n\n\n------ web hook -------\n\n\n\n\n\n', result, '\n\n\n\n');

  fs.writeFileSync(
    path.resolve(__dirname, './webHookLogs.json'),
    `${JSON.stringify(ctx.request.body, null, 2)}\n\n
    ${JSON.stringify(ctx.request.header, null, 2)}\n\n
    ${result}`,
    'utf-8'
  );
  console.log('---->>> ok \n\n\n\n\n\n\n');
  ctx.body = '成功';
}

// const secret = "your_secret_here";
// const repo = "~/your_repo_path_here/";
// ​
// const http = require('http');
// const crypto = require('crypto');
// const exec = require('child_process').exec;
// ​
// http.createServer(function (req, res) {
//     req.on('data', function(chunk) {
//         let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');
// ​
//         if (req.headers['x-hub-signature'] == sig) {
//             exec('cd ' + repo + ' && git pull');
//         }
//     });
// ​
//     res.end();
// }).listen(8080);
// import { createHmac } from "crypto";
// import rawBody from "raw-body";

// /**
//  * @typedef {Function} KoaHandler
//  * @param {Context} ctx
//  * @param {Function} next
//  */

// /**
//  * @typedef {Function} WebhookHandler
//  * @param {Object} request decoded request body
//  * @param {string} event from 'x-github-event' header
//  * @param {Context} ctx from koa
//  */

// /**
//  * Create a koa middleware suitable to bridge github webhook requests to KoaHandlers
//  * @param {Object} actions holding all the handles for the events (event is the key)
//  * @param {WebhookHandler} actions.event  (event is the key)
//  * @param {Object} config
//  * @param {string} config.secret to decode signature
//  * @return {KoaHandler} suitable as koa middleware
//  */
// export function createGithubHookHandler(actions, config = {}) {
//   return async (ctx, next) => {
//     const [sig, event, id] = headers(ctx, [
//       "x-hub-signature",
//       "x-github-event",
//       "x-github-delivery"
//     ]);

//     const body = await rawBody(ctx.req);

//     if (!verify(sig, body, config.secret)) {
//       ctx.throw(401, "x-hub-signature does not match blob signature");
//     }

//     const handler = actions[event] || actions.default;

//     if (handler !== undefined) {
//       const data = JSON.parse(body.toString());
//       ctx.body = await handler(data, event, ctx);
//     } else {
//       ctx.throw(`unknown event type ${event}`);
//     }
//     return next();
//   };
// }

// /**
//  * Create a koa middleware suitable to bridge gitea webhook requests to KoaHandlers
//  * @param {Object} actions holding all the handles for the events (event is the key)
//  * @param {WebhookHandler} actions.event  (event is the key)
//  * @param {Object} config
//  * @param {string} config.secret to decode signature
//  * @return {KoaHandler} suitable as koa middleware
//  */
// export function createGiteaHookHandler(actions, config = {}) {
//   return async (ctx, next) => {
//     const [event, id] = headers(ctx, ["x-gitea-event", "x-gitea-delivery"]);

//     const body = await rawBody(ctx.req);
//     const data = JSON.parse(body.toString());

//     if (config.secret !== data.secret) {
//       ctx.throw(401, "incorrect credentials");
//     }

//     const handler = actions[event] || actions.default;

//     if (handler !== undefined) {
//       ctx.body = await handler(data, event, ctx);
//     } else {
//       ctx.throw(`unknown event type ${event}`);
//     }
//     return next();
//   };
// }

// /**
//  * Create a koa middleware suitable to bridge gitea webhook requests to KoaHandlers
//  * @param {Object} actions holding all the handles for the events (event is the key)
//  * @param {WebhookHandler} actions.event  (event is the key)
//  * @param {Object} config
//  * @param {string} config.secret to decode signature
//  * @return {KoaHandler} suitable as koa middleware
//  */
// export function createBitbucketHookHandler(actions, config = {}) {
//   return async (ctx, next) => {
//     const [event] = headers(ctx, ["X-Event-Key"]);

//     const body = await rawBody(ctx.req);
//     const data = JSON.parse(body.toString());

//     const handler = actions[event] || actions.default;

//     if (handler !== undefined) {
//       ctx.body = await handler(data, event, ctx);
//     } else {
//       ctx.throw(`unknown event type ${event}`);
//     }
//     return next();
//   };
// }

// function headers(ctx, names) {
//   return names.map(name => {
//     const v = ctx.get(name);
//     if (v === undefined || v.length === 0) {
//       ctx.throw(400, `${name} required`);
//     }
//     return v;
//   });
// }

// function sign(data, secret) {
//   return (
//     "sha1=" +
//     createHmac("sha1", secret)
//       .update(data)
//       .digest("hex")
//   );
// }

// function verify(signature, data, secret) {
//   return Buffer.from(signature).equals(Buffer.from(sign(data, secret)));
// }
