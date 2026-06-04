#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const url = args.url;
  const duration = args.duration ? parseInt(args.duration, 10) : 10000;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  try {
    await withBrowser(args, async (page) => {
      const client = await page.target().createCDPSession();
      await client.send('Network.enable');

      const events = [];

      client.on('Network.webSocketCreated', (e) => {
        events.push({ type: 'created', requestId: e.requestId, url: e.url, timestamp: Date.now() });
      });
      client.on('Network.webSocketWillSendHandshakeRequest', (e) => {
        events.push({ type: 'handshake-request', requestId: e.requestId, timestamp: Date.now() });
      });
      client.on('Network.webSocketHandshakeResponseReceived', (e) => {
        events.push({
          type: 'handshake-response',
          requestId: e.requestId,
          status: e.response.status,
          timestamp: Date.now(),
        });
      });
      client.on('Network.webSocketClosed', (e) => {
        events.push({ type: 'closed', requestId: e.requestId, timestamp: Date.now() });
      });
      client.on('Network.webSocketFrameError', (e) => {
        events.push({
          type: 'frame-error',
          requestId: e.requestId,
          errorMessage: e.errorMessage,
          timestamp: Date.now(),
        });
      });

      if (url) await page.goto(url, { timeout, waitUntil });

      await new Promise((r) => setTimeout(r, duration));

      outputJSON({
        success: true,
        url: page.url(),
        duration,
        count: events.length,
        events,
      });
    });
  } catch (err) {
    outputError(err);
  }
}

main();
