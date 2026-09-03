// import { AccordionSection } from "@/components/bienestar/AccordionSection";
// import { CarouselSection } from "@/components/bienestar/CarouselSection";
import { Section } from "@/components/bienestar/sections/Section";
import { AccordionSection } from "@/components/bienestar/sections/AccordionSection";
import { CarouselSection } from "@/components/bienestar/sections/CarouselSection";
import { Content } from "@/types/bienestar/section-components";

export interface DynamicSectionsProps {
  content?: Content;
}

export function DynamicSections({ content }: DynamicSectionsProps) {
  return content?.map((section, index) => {
    if (section.__component === "section-components.section") {
      return <Section key={index} {...section} />;
    } else if (section.__component === "section-components.accordion-section") {
      return <AccordionSection key={index} {...section} />;
    } else if (section.__component === "section-components.carousel") {
      return <CarouselSection key={index} {...section} />;
    }
  });
}
