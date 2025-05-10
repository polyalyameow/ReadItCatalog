import { createServer } from "http";
import app from "../app";

import { VercelRequest, VercelResponse } from "@vercel/node";
import { Server } from "http";

import dotenv from 'dotenv';
dotenv.config()

let server: Server | undefined;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!server) {
    server = createServer(app);
  }
  
  server.emit("request", req, res);
}
