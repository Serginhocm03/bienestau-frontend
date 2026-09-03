import { Media } from "@/types/bienestar/primitives";

export type Carousel = {
  id: number;
  __component: "section-components.carousel";
  title?: string;
  images: Media[];
};

export type Section = {
  id: number;
  __component?: "section-components.section";
  title?: string;
  image?: Media;
  description?: string;
  design: "top" | "right" | "left" | "bottom";
};

export type AccordionSection = {
  id: number;
  __component: "section-components.accordion-section";
  title?: string;
  collapsibles: Section[];
};

export type Content = (Section | AccordionSection | Carousel)[];
