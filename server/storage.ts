import { users, communities, type User, type InsertUser, type Community, type InsertCommunity } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCommunity(community: InsertCommunity): Promise<Community>;
  getCommunity(id: number): Promise<Community | undefined>;
  getAllCommunities(): Promise<Community[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private communities: Map<number, Community>;
  private currentUserId: number;
  private currentCommunityId: number;

  constructor() {
    this.users = new Map();
    this.communities = new Map();
    this.currentUserId = 1;
    this.currentCommunityId = 1;
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
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCommunity(insertCommunity: InsertCommunity): Promise<Community> {
    const id = this.currentCommunityId++;
    const community: Community = { 
      ...insertCommunity, 
      id,
      createdAt: new Date()
    };
    this.communities.set(id, community);
    return community;
  }

  async getCommunity(id: number): Promise<Community | undefined> {
    return this.communities.get(id);
  }

  async getAllCommunities(): Promise<Community[]> {
    return Array.from(this.communities.values());
  }
}

export const storage = new MemStorage();
