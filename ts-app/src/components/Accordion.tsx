"use client";

// ============================================================
// [C1] Compound Component Pattern — Custom Accordion
// Uses React Context to share state between parent and children.
// Components: <Accordion>, <Accordion.Item>, <Accordion.Trigger>,
//             <Accordion.Content>
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ---- Accordion Context ----

type AccordionContextType = {
  openItems: Set<string>;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext(): AccordionContextType {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Accordion compound components must be used within <Accordion>");
  }
  return ctx;
}

// ---- Item Context (to pass item id to children) ----

type ItemContextType = { id: string };
const ItemContext = createContext<ItemContextType | null>(null);

function useItemContext(): ItemContextType {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error("Accordion.Trigger/Content must be used within <Accordion.Item>");
  }
  return ctx;
}

// ---- Accordion Root ----

type AccordionProps = {
  children: ReactNode;
  allowMultiple?: boolean;
};

function AccordionRoot({ children, allowMultiple = false }: AccordionProps) {
  // [TS4] Typed useState
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="divide-y divide-soft-cyan rounded-lg border border-soft-cyan bg-white">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ---- Accordion.Item ----

type AccordionItemProps = {
  children: ReactNode;
  id: string;
};

function AccordionItem({ children, id }: AccordionItemProps) {
  return (
    <ItemContext.Provider value={{ id }}>
      <div className="overflow-hidden">{children}</div>
    </ItemContext.Provider>
  );
}

// ---- Accordion.Trigger ----

type AccordionTriggerProps = {
  children: ReactNode;
};

function AccordionTrigger({ children }: AccordionTriggerProps) {
  const { openItems, toggle } = useAccordionContext();
  const { id } = useItemContext();
  const isOpen = openItems.has(id);

  return (
    <button
      onClick={() => toggle(id)}
      className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-dark-blue
                 hover:bg-pale-blue focus:outline-none focus:ring-2 focus:ring-ocean-blue/30
                 transition-colors duration-200 cursor-pointer"
      aria-expanded={isOpen}
    >
      <span>{children}</span>
      <svg
        className={`h-5 w-5 text-ocean-blue transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// ---- Accordion.Content ----

type AccordionContentProps = {
  children: ReactNode;
};

function AccordionContent({ children }: AccordionContentProps) {
  const { openItems } = useAccordionContext();
  const { id } = useItemContext();
  const isOpen = openItems.has(id);

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-5 pb-4 text-dark-blue/80 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// ---- Compound Component Export ----

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
