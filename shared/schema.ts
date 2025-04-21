import { mysqlTable, int, varchar, datetime, text } from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: datetime('created_at').notNull().default(new Date()),
  updatedAt: datetime('updated_at').notNull().default(new Date()),
});

// Events table
export const events = mysqlTable('events', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date').notNull(),
  location: varchar('location', { length: 255 }),
  maxParticipants: int('max_participants'),
  creatorId: int('creator_id').notNull().references(() => users.id),
  createdAt: datetime('created_at').notNull().default(new Date()),
  updatedAt: datetime('updated_at').notNull().default(new Date()),
});

// Teams table
export const teams = mysqlTable('teams', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  eventId: int('event_id').notNull().references(() => events.id),
  leaderId: int('leader_id').notNull().references(() => users.id),
  createdAt: datetime('created_at').notNull().default(new Date()),
  updatedAt: datetime('updated_at').notNull().default(new Date()),
});

// Team Members table
export const teamMembers = mysqlTable('team_members', {
  id: int('id').autoincrement().primaryKey(),
  teamId: int('team_id').notNull().references(() => teams.id),
  userId: int('user_id').notNull().references(() => users.id),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  joinedAt: datetime('joined_at').notNull().default(new Date()),
});

export const registrations = mysqlTable("registrations", {
  id: int('id').autoincrement().primaryKey(),
  eventId: int('event_id').notNull().references(() => events.id),
  userId: int('user_id').notNull().references(() => users.id),
  teamId: int('team_id').references(() => teams.id),
  status: varchar('status', { length: 50 }).notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true
}).extend({
  role: z.enum(['organizer', 'participant'])
    .refine(val => ['organizer', 'participant'].includes(val), {
      message: "Role must be either 'organizer' or 'participant'"
    })
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  location: true,
  maxParticipants: true
}).extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  maxParticipants: z.number().min(1, "Max participants must be at least 1")
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  eventId: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Registration = typeof registrations.$inferSelect;