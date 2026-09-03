import { Person } from "@/types/bienestar/collections";
import { Contact, Header } from "@/types/bienestar/components";
import { Content } from "@/types/bienestar/section-components";

export type Home = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  header: Header;
  content: Content;
};

export type ReminderPage = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  header: Header;
};

export type Welfare = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  header: Header;
  director: Person;
  contact: Contact;
  content: Content;
};
