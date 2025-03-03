import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/events", async (req, res) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertEventSchema.parse(req.body);
    const event = await storage.createEvent({
      ...parsed,
      creatorId: req.user.id
    });
    res.json(event);
  });

  app.post("/api/events/:eventId/register", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const eventId = parseInt(req.params.eventId);
    const registration = await storage.createRegistration({
      eventId,
      userId: req.user.id,
      status: "pending"
    });
    res.json(registration);
  });

  app.post("/api/events/:eventId/teams", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const schema = z.object({
      name: z.string().min(1)
    });
    
    const eventId = parseInt(req.params.eventId);
    const { name } = schema.parse(req.body);
    
    const team = await storage.createTeam({
      name,
      eventId,
      leaderId: req.user.id
    });
    res.json(team);
  });

  app.get("/api/events/:eventId/teams", async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const teams = await storage.getTeamsByEventId(eventId);
    res.json(teams);
  });

  const httpServer = createServer(app);
  return httpServer;
}
