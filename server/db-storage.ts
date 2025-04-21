import { eq, and } from 'drizzle-orm';
import session from 'express-session';
import { db } from './db';
import { users, events, teams, teamMembers, registrations } from '../shared/schema';
import type { User, Event, Team, TeamMember, Registration, InsertUser } from '../shared/schema';
import { IStorage } from './storage.interface';
import mysqlSession from 'express-mysql-session';

// Define the shape of our MySQL insert result
interface ExtendedMySqlInsertResult {
  insertId: number | bigint;
}

export class DbStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create MySQL session store
    const MySQLStore = mysqlSession(session);
    
    // Parse MySQL connection string from DATABASE_URL
    const connectionString = process.env.DATABASE_URL || '';
    const url = new URL(connectionString);
    
    const options = {
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
      // Table creation options
      createDatabaseTable: true,
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    };
    
    this.sessionStore = new MySQLStore(options);
    console.log('MySQL session store initialized');
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
    const result = await db.insert(users).values(insertUser) as unknown as ExtendedMySqlInsertResult;
    const insertId = Number(result.insertId);
    return this.getUser(insertId) as Promise<User>;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const result = await db.insert(events).values(event) as unknown as ExtendedMySqlInsertResult;
    const insertId = Number(result.insertId);
    return (await db.select().from(events).where(eq(events.id, insertId)))[0];
  }

  async createTeam(team: Omit<Team, "id">): Promise<Team> {
    const result = await db.insert(teams).values(team) as unknown as ExtendedMySqlInsertResult;
    const insertId = Number(result.insertId);
    return (await db.select().from(teams).where(eq(teams.id, insertId)))[0];
  }

  async getTeamsByEventId(eventId: number): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.eventId, eventId));
  }
  
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }
  
  async addTeamMember(teamId: number, userId: number): Promise<TeamMember> {
    const result = await db.insert(teamMembers).values({ teamId, userId }) as unknown as ExtendedMySqlInsertResult;
    const insertId = Number(result.insertId);
    return (await db.select().from(teamMembers).where(eq(teamMembers.id, insertId)))[0];
  }

  async createRegistration(registration: Omit<Registration, "id">): Promise<Registration> {
    const result = await db.insert(registrations).values(registration) as unknown as ExtendedMySqlInsertResult;
    const insertId = Number(result.insertId);
    return (await db.select().from(registrations).where(eq(registrations.id, insertId)))[0];
  }
} 