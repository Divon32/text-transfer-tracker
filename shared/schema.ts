import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  rename: text("rename").notNull(),
  robuxFund: text("robux_fund").notNull(),
  communitiesMember: text("communities_member").notNull(),
  ownerUsername: text("owner_username").notNull(),
  originalContent: text("original_content").notNull(),
  generatedContent: text("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  createdAt: true,
});

export const createCommunitySchema = z.object({
  rename: z.string().min(1, "Rename is required"),
  robuxFund: z.string().min(1, "Robux Fund is required"),
  communitiesMember: z.string().min(1, "Communities Member is required"),
  ownerUsername: z.string().min(1, "Owner Username is required"),
  textContent: z.string().min(1, "Communities text content is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communities.$inferSelect;
export type CreateCommunityRequest = z.infer<typeof createCommunitySchema>;
