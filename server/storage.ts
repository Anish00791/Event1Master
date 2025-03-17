import { IStorage } from "./storage.interface";
import type { User, Event, Team, Registration, InsertUser, TeamMember } from "../shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { DbStorage } from "./db-storage";
import fs from 'fs';
import path from 'path';

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private registrations: Map<number, Registration>;
  private currentId: number;
  sessionStore: session.Store;
  private storageFile: string;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.registrations = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Use absolute path for storage file
    this.storageFile = path.join(process.cwd(), 'data', 'storage.json');
    
    // Create directory if it doesn't exist
    const dataDir = path.dirname(this.storageFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.loadFromFile();
    
    // Set up an interval to save data periodically
    setInterval(() => this.saveToFile(), 60000);
  }
  
  private loadFromFile() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const data = JSON.parse(fs.readFileSync(this.storageFile, 'utf8'));
        
        if (data.users) {
          this.users = new Map(Object.entries(data.users).map(([k, v]) => [parseInt(k), v as User]));
        }
        
        if (data.events) {
          this.events = new Map(Object.entries(data.events).map(([k, v]) => [parseInt(k), v as Event]));
        }
        
        if (data.teams) {
          this.teams = new Map(Object.entries(data.teams).map(([k, v]) => [parseInt(k), v as Team]));
        }
        
        if (data.teamMembers) {
          this.teamMembers = new Map(Object.entries(data.teamMembers).map(([k, v]) => [parseInt(k), v as TeamMember]));
        }
        
        if (data.registrations) {
          this.registrations = new Map(Object.entries(data.registrations).map(([k, v]) => [parseInt(k), v as Registration]));
        }
        
        if (data.currentId) {
          this.currentId = data.currentId;
        }
        
        console.log('Loaded data from storage file');
      }
    } catch (error) {
      console.error('Failed to load data from file:', error);
    }
  }
  
  private saveToFile() {
    try {
      const data = {
        users: Object.fromEntries(this.users.entries()),
        events: Object.fromEntries(this.events.entries()),
        teams: Object.fromEntries(this.teams.entries()),
        teamMembers: Object.fromEntries(this.teamMembers.entries()),
        registrations: Object.fromEntries(this.registrations.entries()),
        currentId: this.currentId
      };
      
      fs.writeFileSync(this.storageFile, JSON.stringify(data, null, 2));
      console.log('Saved data to storage file');
    } catch (error) {
      console.error('Failed to save data to file:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    this.saveToFile();
    return user;
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values());
  }

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const id = this.currentId++;
    const newEvent = { ...event, id };
    this.events.set(id, newEvent);
    this.saveToFile();
    return newEvent;
  }
  
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (member) => member.teamId === teamId
    );
  }

  async createTeam(team: Omit<Team, "id">): Promise<Team> {
    const id = this.currentId++;
    const newTeam = { ...team, id };
    this.teams.set(id, newTeam);
    this.saveToFile();
    return newTeam;
  }
  
  async addTeamMember(teamId: number, userId: number): Promise<TeamMember> {
    const id = this.currentId++;
    const member = { id, teamId, userId };
    this.teamMembers.set(id, member);
    this.saveToFile();
    return member;
  }

  async getTeamsByEventId(eventId: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(
      (team) => team.eventId === eventId
    );
  }

  async createRegistration(registration: Omit<Registration, "id">): Promise<Registration> {
    const id = this.currentId++;
    const newRegistration = { ...registration, id };
    this.registrations.set(id, newRegistration);
    this.saveToFile();
    return newRegistration;
  }
}

// Create the storage instance
export const storage = new MemStorage();

console.log('Using in-memory SQLite-like storage with file persistence');