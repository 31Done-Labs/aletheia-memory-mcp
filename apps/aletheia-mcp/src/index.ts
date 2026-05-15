import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AletheiaMcpServer } from './server.js';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 42061;

// Allow all origins as requested
app.use(cors());

const mcpServer = new AletheiaMcpServer();
const transports = new Map<string, SSEServerTransport>();

// SSE Endpoint
app.get('/mcp', async (req, res) => {
  const sessionId = crypto.randomUUID();
  console.log(`New SSE connection established: ${sessionId}`);
  const transport = new SSEServerTransport(`/messages?sessionId=${sessionId}`, res);
  transports.set(sessionId, transport);
  res.on('close', () => transports.delete(sessionId));
  await mcpServer.getMcpServer().connect(transport);
});

// Message Endpoint for SSE
app.post('/messages', express.json(), async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No active SSE transport for this session');
  }
});

// Also support Stdio if launched directly with --stdio
if (process.argv.includes('--stdio')) {
  const stdioTransport = new StdioServerTransport();
  mcpServer.getMcpServer().connect(stdioTransport).catch(console.error);
} else {
  // Start HTTP Server
  app.listen(port, () => {
    console.log(`Aletheia MCP Server listening at http://localhost:${port}`);
    console.log(`SSE endpoint: http://localhost:${port}/mcp`);
    console.log(`Message endpoint: http://localhost:${port}/messages`);
  });
}
