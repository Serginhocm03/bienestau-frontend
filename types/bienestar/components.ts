import { Media } from "@/types/bienestar/primitives";

export type Layout = {
  height: number;
  minHeight: number;
};

export type Header = {
  title: string;
  image?: Media;
};

export type Contact = {
  id: number;
  email?: string;
  phone?: string;
  address?: string;
  extra?: string;
};
