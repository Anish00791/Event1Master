import { eq, and } from 'drizzle-orm';
import session from 'express-session';
import { db } from './db';
import { users, events, teams, teamMembers, registrations } from '../shared/schema';
import type { User, Event, Team, TeamMember, Registration, InsertUser } from '../shared/schema';
import PgSession from 'connect-pg-simple';
import { IStorage } from './storage.interface';

export class DbStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PgStore = PgSession(session);
    this.sessionStore = new PgStore({
      conString: process.env.DATABASE_URL,
      tableName: 'sessions',
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async createTeam(team: Omit<Team, "id">): Promise<Team> {
    const result = await db.insert(teams).values(team).returning();
    return result[0];
  }

  async getTeamsByEventId(eventId: number): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.eventId, eventId));
  }
  
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }
  
  async addTeamMember(teamId: number, userId: number): Promise<TeamMember> {
    const result = await db.insert(teamMembers)
      .values({ teamId, userId })
      .returning();
    return result[0];
  }

  async createRegistration(registration: Omit<Registration, "id">): Promise<Registration> {
    const result = await db.insert(registrations).values(registration).returning();
    return result[0];
  }
} 