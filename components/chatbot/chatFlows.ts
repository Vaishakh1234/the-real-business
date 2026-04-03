/**
 * Rule-based chatbot decision tree — pure data, no React.
 * Path segments are joined for the lead `message` body so admins see the full journey.
 */

export type ChatNodeId =
  | "welcome"
  | "buy_property_type"
  | "buy_budget"
  | "buy_area"
  | "sell_what"
  | "sell_timeline"
  | "rent_property_type"
  | "rent_budget"
  | "visit_property"
  | "visit_when"
  | "general_message"
  | "faq_menu"
  | "faq_hours"
  | "faq_location"
  | "faq_services"
  | "faq_list"
  | "lead_name"
  | "lead_email"
  | "lead_phone"
  | "lead_notes"
  | "lead_submitting";

export type TextInputFieldKey =
  | "propertyRef"
  | "visitWhen"
  | "generalMessage"
  | "leadName"
  | "leadEmail"
  | "leadPhone"
  | "leadNotes";

export interface ChatOption {
  id: string;
  label: string;
  next: ChatNodeId;
  /** Appended to the lead context path (e.g. "Buy > Plot") */
  pathSegment: string;
}

export interface ChatNodeReplies {
  id: ChatNodeId;
  type: "replies";
  botMessage: string;
  options: ChatOption[];
}

export interface ChatNodeTextInput {
  id: ChatNodeId;
  type: "text_input";
  botMessage: string;
  placeholder: string;
  next: ChatNodeId;
  fieldKey: TextInputFieldKey;
  submitLabel?: string;
}

export interface ChatNodeAutoSubmit {
  id: ChatNodeId;
  type: "lead_auto_submit";
  botMessage: string;
}

export type ChatNode =
  | ChatNodeReplies
  | ChatNodeTextInput
  | ChatNodeAutoSubmit;

export const CHATBOT_STORAGE_KEY = "trb_chatbot_state_v1";

export const CHAT_NODES: Record<ChatNodeId, ChatNode> = {
  welcome: {
    id: "welcome",
    type: "replies",
    botMessage:
      "Hi — I’m Leon from The Real Business. How can I help you today?",
    options: [
      {
        id: "buy",
        label: "I want to buy",
        next: "buy_property_type",
        pathSegment: "Buy",
      },
      {
        id: "sell",
        label: "I want to sell",
        next: "sell_what",
        pathSegment: "Sell",
      },
      {
        id: "rent",
        label: "Looking to rent",
        next: "rent_property_type",
        pathSegment: "Rent",
      },
      {
        id: "visit",
        label: "Schedule a site visit",
        next: "visit_property",
        pathSegment: "Site visit",
      },
      {
        id: "general",
        label: "General question",
        next: "general_message",
        pathSegment: "General inquiry",
      },
      {
        id: "faq",
        label: "Quick answers (FAQ)",
        next: "faq_menu",
        pathSegment: "FAQ",
      },
    ],
  },

  buy_property_type: {
    id: "buy_property_type",
    type: "replies",
    botMessage: "What type of property are you looking for?",
    options: [
      {
        id: "plot",
        label: "Plot / land",
        next: "buy_budget",
        pathSegment: "Plot or land",
      },
      {
        id: "house",
        label: "House / villa",
        next: "buy_budget",
        pathSegment: "House or villa",
      },
      {
        id: "flat",
        label: "Flat / apartment",
        next: "buy_budget",
        pathSegment: "Flat or apartment",
      },
      {
        id: "commercial",
        label: "Commercial",
        next: "buy_budget",
        pathSegment: "Commercial",
      },
    ],
  },

  buy_budget: {
    id: "buy_budget",
    type: "replies",
    botMessage: "What’s your approximate budget?",
    options: [
      {
        id: "under20",
        label: "Under ₹20 lakh",
        next: "buy_area",
        pathSegment: "Budget under ₹20L",
      },
      {
        id: "20_50",
        label: "₹20 lakh – ₹50 lakh",
        next: "buy_area",
        pathSegment: "Budget ₹20L–₹50L",
      },
      {
        id: "50_1cr",
        label: "₹50 lakh – ₹1 crore",
        next: "buy_area",
        pathSegment: "Budget ₹50L–₹1Cr",
      },
      {
        id: "1cr_plus",
        label: "Above ₹1 crore",
        next: "buy_area",
        pathSegment: "Budget above ₹1Cr",
      },
      {
        id: "flex",
        label: "Still deciding",
        next: "buy_area",
        pathSegment: "Budget flexible / TBD",
      },
    ],
  },

  buy_area: {
    id: "buy_area",
    type: "replies",
    botMessage: "Preferred area in or around Palakkad?",
    options: [
      {
        id: "town",
        label: "Palakkad town",
        next: "lead_name",
        pathSegment: "Area: Palakkad town",
      },
      {
        id: "ottapalam",
        label: "Ottapalam",
        next: "lead_name",
        pathSegment: "Area: Ottapalam",
      },
      {
        id: "chittur",
        label: "Chittur / nearby",
        next: "lead_name",
        pathSegment: "Area: Chittur / nearby",
      },
      {
        id: "mannarkkad",
        label: "Mannarkkad / nearby",
        next: "lead_name",
        pathSegment: "Area: Mannarkkad / nearby",
      },
      {
        id: "open",
        label: "Open to suggestions",
        next: "lead_name",
        pathSegment: "Area: open to suggestions",
      },
    ],
  },

  sell_what: {
    id: "sell_what",
    type: "replies",
    botMessage: "What would you like to list?",
    options: [
      {
        id: "plot",
        label: "Plot / land",
        next: "sell_timeline",
        pathSegment: "Listing: plot or land",
      },
      {
        id: "house",
        label: "House / villa",
        next: "sell_timeline",
        pathSegment: "Listing: house or villa",
      },
      {
        id: "flat",
        label: "Flat / apartment",
        next: "sell_timeline",
        pathSegment: "Listing: flat or apartment",
      },
      {
        id: "commercial",
        label: "Commercial",
        next: "sell_timeline",
        pathSegment: "Listing: commercial",
      },
    ],
  },

  sell_timeline: {
    id: "sell_timeline",
    type: "replies",
    botMessage: "When are you hoping to go live with the listing?",
    options: [
      {
        id: "asap",
        label: "As soon as possible",
        next: "lead_name",
        pathSegment: "Timeline: ASAP",
      },
      {
        id: "month",
        label: "Within a month",
        next: "lead_name",
        pathSegment: "Timeline: within 1 month",
      },
      {
        id: "explore",
        label: "Just exploring",
        next: "lead_name",
        pathSegment: "Timeline: exploring",
      },
    ],
  },

  rent_property_type: {
    id: "rent_property_type",
    type: "replies",
    botMessage: "What kind of rental are you looking for?",
    options: [
      {
        id: "house",
        label: "House / villa",
        next: "rent_budget",
        pathSegment: "Rental: house or villa",
      },
      {
        id: "flat",
        label: "Flat / apartment",
        next: "rent_budget",
        pathSegment: "Rental: flat or apartment",
      },
      {
        id: "commercial",
        label: "Commercial space",
        next: "rent_budget",
        pathSegment: "Rental: commercial",
      },
    ],
  },

  rent_budget: {
    id: "rent_budget",
    type: "replies",
    botMessage: "Monthly budget (approximate)?",
    options: [
      {
        id: "under15",
        label: "Under ₹15,000",
        next: "lead_name",
        pathSegment: "Rent budget: under ₹15k/mo",
      },
      {
        id: "15_30",
        label: "₹15,000 – ₹30,000",
        next: "lead_name",
        pathSegment: "Rent budget: ₹15k–₹30k/mo",
      },
      {
        id: "30_plus",
        label: "Above ₹30,000",
        next: "lead_name",
        pathSegment: "Rent budget: above ₹30k/mo",
      },
      {
        id: "flex",
        label: "Flexible",
        next: "lead_name",
        pathSegment: "Rent budget: flexible",
      },
    ],
  },

  visit_property: {
    id: "visit_property",
    type: "text_input",
    botMessage:
      "Which property would you like to visit? You can paste the listing title, reference (e.g. TRB-…), or a short description.",
    placeholder: "Property title, ref, or description",
    next: "visit_when",
    fieldKey: "propertyRef",
    submitLabel: "Continue",
  },

  visit_when: {
    id: "visit_when",
    type: "text_input",
    botMessage: "When would you prefer the visit? (e.g. weekday morning, Saturday afternoon)",
    placeholder: "Preferred date or time window",
    next: "lead_name",
    fieldKey: "visitWhen",
    submitLabel: "Continue",
  },

  general_message: {
    id: "general_message",
    type: "text_input",
    botMessage: "Tell us briefly what you need — we’ll route it to the right person.",
    placeholder: "Your question or request",
    next: "lead_name",
    fieldKey: "generalMessage",
    submitLabel: "Continue",
  },

  faq_menu: {
    id: "faq_menu",
    type: "replies",
    botMessage: "Pick a topic:",
    options: [
      {
        id: "hours",
        label: "Working hours",
        next: "faq_hours",
        pathSegment: "FAQ: hours",
      },
      {
        id: "location",
        label: "Where you’re based",
        next: "faq_location",
        pathSegment: "FAQ: location",
      },
      {
        id: "services",
        label: "What you offer",
        next: "faq_services",
        pathSegment: "FAQ: services",
      },
      {
        id: "list",
        label: "How to list my property",
        next: "faq_list",
        pathSegment: "FAQ: how to list",
      },
      {
        id: "back",
        label: "Back to main menu",
        next: "welcome",
        pathSegment: "",
      },
    ],
  },

  faq_hours: {
    id: "faq_hours",
    type: "replies",
    botMessage:
      "We’re typically available Monday–Friday 9:00 AM–6:00 PM, and Saturday 10:00 AM–4:00 PM. Need something outside those hours? Leave your details and we’ll get back to you.",
    options: [
      {
        id: "back_faq",
        label: "More FAQ",
        next: "faq_menu",
        pathSegment: "",
      },
      {
        id: "team",
        label: "Talk to the team",
        next: "lead_name",
        pathSegment: "FAQ follow-up: talk to team",
      },
    ],
  },

  faq_location: {
    id: "faq_location",
    type: "replies",
    botMessage:
      "The Real Business is Palakkad-first — we serve Palakkad and surrounding areas across Kerala. Our team can meet you locally for listings and site visits.",
    options: [
      {
        id: "back_faq",
        label: "More FAQ",
        next: "faq_menu",
        pathSegment: "",
      },
      {
        id: "team",
        label: "Talk to the team",
        next: "lead_name",
        pathSegment: "FAQ follow-up: talk to team",
      },
    ],
  },

  faq_services: {
    id: "faq_services",
    type: "replies",
    botMessage:
      "We help with buying, selling, and renting residential and commercial property — including plots, homes, flats, valuations, and guidance for investors and first-time buyers.",
    options: [
      {
        id: "back_faq",
        label: "More FAQ",
        next: "faq_menu",
        pathSegment: "",
      },
      {
        id: "team",
        label: "Talk to the team",
        next: "lead_name",
        pathSegment: "FAQ follow-up: talk to team",
      },
    ],
  },

  faq_list: {
    id: "faq_list",
    type: "replies",
    botMessage:
      "To list your property, we usually start with a short call or visit to understand your asset and agree on marketing. You can also use our “Post property” page on the website.",
    options: [
      {
        id: "back_faq",
        label: "More FAQ",
        next: "faq_menu",
        pathSegment: "",
      },
      {
        id: "team",
        label: "Talk to the team",
        next: "lead_name",
        pathSegment: "FAQ follow-up: list property",
      },
    ],
  },

  lead_name: {
    id: "lead_name",
    type: "text_input",
    botMessage: "Almost done — what's your name?",
    placeholder: "Your full name",
    next: "lead_email",
    fieldKey: "leadName",
    submitLabel: "Continue",
  },

  lead_email: {
    id: "lead_email",
    type: "text_input",
    botMessage: "What's your email? Press Continue to skip.",
    placeholder: "you@example.com",
    next: "lead_phone",
    fieldKey: "leadEmail",
    submitLabel: "Continue",
  },

  lead_phone: {
    id: "lead_phone",
    type: "text_input",
    botMessage: "And your phone or WhatsApp number? Press Continue to skip.",
    placeholder: "WhatsApp or mobile number",
    next: "lead_notes",
    fieldKey: "leadPhone",
    submitLabel: "Continue",
  },

  lead_notes: {
    id: "lead_notes",
    type: "text_input",
    botMessage: "Anything else you'd like to tell us? Press Continue to skip.",
    placeholder: "Optional message",
    next: "lead_submitting",
    fieldKey: "leadNotes",
    submitLabel: "Send",
  },

  lead_submitting: {
    id: "lead_submitting",
    type: "lead_auto_submit",
    botMessage: "Perfect — sending your details to our team…",
  },
};

export function getChatNode(id: ChatNodeId): ChatNode {
  return CHAT_NODES[id];
}

export interface TextFieldValues {
  propertyRef?: string;
  visitWhen?: string;
  generalMessage?: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  leadNotes?: string;
}

export function buildLeadMessage(
  pathSegments: string[],
  textFields: TextFieldValues,
): string {
  const flow = pathSegments.filter(Boolean).join(" > ");
  const lines: string[] = ["[Chatbot lead]", ""];
  if (flow) {
    lines.push(`Flow: ${flow}`, "");
  }
  if (textFields.propertyRef?.trim()) {
    lines.push(`Property / visit target: ${textFields.propertyRef.trim()}`, "");
  }
  if (textFields.visitWhen?.trim()) {
    lines.push(`Preferred visit time: ${textFields.visitWhen.trim()}`, "");
  }
  if (textFields.generalMessage?.trim()) {
    lines.push(`Message: ${textFields.generalMessage.trim()}`, "");
  }
  return lines.join("\n").trim();
}
