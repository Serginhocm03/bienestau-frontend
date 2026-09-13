import { Contact, Header } from "@/types/bienestar/components";
import { Media } from "@/types/bienestar/primitives";
import { Content, Section } from "@/types/bienestar/section-components";

export type ActionLine = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  header: Header;
  directors: Person[];
  contact: Contact;
  content: Content;
  programs: Program[];
};

export type Program = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  section: Section;
};

export type Reminder = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  to: "all" | "students" | "managers";
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  contentId?: string;
  contentType?: 'news' | 'event';
};

export type Person = {
  id: number;
  documentId: string;
  name: string;
  role: string;
  action_line?: ActionLine;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  contentId?: string;
  contentType?: 'news' | 'event';
};

export type User = {
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  documentId: string;
  email: string;
  id: number;
  provider: string;
  publishedAt: string;
  token?: string;
  updatedAt: string;
  username: string;
  type: "student" | "manager";
};

export type EventCollection = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: Media;
};

export type New = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: Media;
};
