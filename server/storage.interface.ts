import session from "express-session";
import type { User, Event, Team, TeamMember, Registration, InsertUser } from "../shared/schema";

export interface IStorage {
  sessionStore: session.Store;
  
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllEvents(): Promise<Event[]>;
  createEvent(event: Omit<Event, "id">): Promise<Event>;
  
  getAllRegistrations(): Promise<Registration[]>;
  createRegistration(registration: Omit<Registration, "id">): Promise<Registration>;
  
  getTeamsByEventId(eventId: number): Promise<Team[]>;
  createTeam(team: Omit<Team, "id">): Promise<Team>;
  
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(teamId: number, userId: number): Promise<TeamMember>;
} 