import {
  ActionLine,
  EventCollection,
  New,
  Reminder,
  User,
} from "@/types/bienestar/collections";
import { Home, ReminderPage, Welfare } from "@/types/bienestar/pages";
import { Meta } from "@/types/bienestar/primitives";

export type ErrorResponse = {
  data: null;
  error: {
    status: string;
    name: string;
    message: string;
    details: {
      [key: string]: any;
    };
  };
};

export type AuthLocalRequest = {
  identifier: string;
  password: string;
};

export type AuthLocalResponse = {
  jwt: string;
  user: User;
};

export type AuthLocalRegisterRequest = {
  username: string; // same as email
  name: string;
  email: string;
  password: string;
  type: "student" | "manager";
  token?: string;
};

export type AuthLocalRegisterResponse = AuthLocalResponse;

export type HomeResponse = {
  data: Home;
  meta: Meta;
};

export type ReminderPageResponse = {
  data: ReminderPage;
  meta: Meta;
};

export type WelfareResponse = {
  data: Welfare;
  meta: Meta;
};

export type EventsResponse = {
  data: EventCollection[];
  meta: Meta;
};

export type NewsResponse = {
  data: New[];
  meta: Meta;
};

export type RemindersResponse = {
  data: Reminder[];
  meta: Meta;
};

export type ActionLinesResponse = {
  data: ActionLine[];
  meta: Meta;
};
