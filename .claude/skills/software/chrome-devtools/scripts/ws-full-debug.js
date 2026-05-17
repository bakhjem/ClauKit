#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const url = args.url;
  const duration = args.duration ? parseInt(args.duration, 10) : 10000;
  const maxPayload = args['max-payload'] ? parseInt(args['max-payload'], 10) : 2000;
  const maxSent = args['max-payload-sent'] ? parseInt(args['max-payload-sent'], 10) : maxPayload;
  const maxReceived = args['max-payload-received'] ? parseInt(args['max-payload-received'], 10) : maxPayload;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  const truncate = (s, limit) => {
    if (typeof s !== 'string') return s;
    return s.length > limit ? s.slice(0, limit) + `... [truncated ${s.length - limit} chars]` : s;
  };

  try {
    await withBrowser(args, async (page) => {
      const client = await page.target().createCDPSession();
      await client.send('Network.enable');

      const events = [];
      const sockets = new Map();

      client.on('Network.webSocketCreated', (e) => {
        sockets.set(e.requestId, { url: e.url, framesSent: 0, framesReceived: 0 });
        events.push({ type: 'created', requestId: e.requestId, url: e.url, timestamp: Date.now() });
      });
      client.on('Network.webSocketWillSendHandshakeRequest', (e) => {
        events.push({
          type: 'handshake-request',
          requestId: e.requestId,
          headers: e.request.headers,
          timestamp: Date.now(),
        });
      });
      client.on('Network.webSocketHandshakeResponseReceived', (e) => {
        events.push({
          type: 'handshake-response',
          requestId: e.requestId,
          status: e.response.status,
          headers: e.response.headers,
          timestamp: Date.now(),
        });
      });
      client.on('Network.webSocketFrameSent', (e) => {
        const s = sockets.get(e.requestId);
        if (s) s.framesSent++;
        events.push({
          type: 'frame-sent',
          requestId: e.requestId,
          opcode: e.response.opcode,
          payloadData: truncate(e.response.payloadData, maxSent),
          timestamp: Date.now(),
        });
      });
      client.on('Network.webSocketFrameReceived', (e) => {
        const s = sockets.get(e.requestId);
        if (s) s.framesReceived++;
        events.push({
          type: 'frame-received',
          requestId: e.requestId,
          opcode: e.response.opcode,
          payloadData: truncate(e.response.payloadData, maxReceived),
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
        sockets: Object.fromEntries(sockets),
        eventCount: events.length,
        events,
      });
    });
  } catch (err) {
    outputError(err);
  }
}

main();
