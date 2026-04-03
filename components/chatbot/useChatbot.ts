"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  type ChatNodeId,
  type ChatOption,
  CHAT_NODES,
  CHATBOT_STORAGE_KEY,
  type TextFieldValues,
  getChatNode,
} from "./chatFlows";

export type ChatRole = "bot" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface ChatbotState {
  panelOpen: boolean;
  messages: ChatMessage[];
  currentNodeId: ChatNodeId;
  pathSegments: string[];
  textFields: TextFieldValues;
  /** After successful lead submit */
  submitted: boolean;
  /** Lead API error */
  submitError: string | null;
}

type ChatbotAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SELECT_OPTION"; option: ChatOption }
  | { type: "SUBMIT_TEXT"; text: string }
  | { type: "RESET_CONVERSATION" }
  | { type: "HYDRATE"; payload: Partial<ChatbotState> }
  | { type: "LEAD_SUCCESS" }
  | { type: "LEAD_ERROR"; message: string }
  | { type: "CLEAR_SUBMIT_ERROR" };

function createInitialState(): ChatbotState {
  const welcome = getChatNode("welcome");
  return {
    panelOpen: false,
    messages: [
      {
        id: uid(),
        role: "bot",
        text:
          welcome.type === "replies"
            ? welcome.botMessage
            : "Hi — how can we help?",
      },
    ],
    currentNodeId: "welcome",
    pathSegments: [],
    textFields: {},
    submitted: false,
    submitError: null,
  };
}

function reduce(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case "OPEN":
      return { ...state, panelOpen: true };
    case "CLOSE":
      return { ...state, panelOpen: false };
    case "TOGGLE":
      return { ...state, panelOpen: !state.panelOpen };
    case "CLEAR_SUBMIT_ERROR":
      return { ...state, submitError: null };
    case "LEAD_SUCCESS":
      return {
        ...state,
        submitted: true,
        submitError: null,
      };
    case "LEAD_ERROR":
      return { ...state, submitError: action.message };
    case "RESET_CONVERSATION":
      return createInitialState();
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        panelOpen: state.panelOpen,
        submitError: null,
      };
    case "SELECT_OPTION": {
      const { option } = action;
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        text: option.label,
      };
      let pathSegments = [...state.pathSegments];
      if (option.pathSegment) {
        pathSegments = [...pathSegments, option.pathSegment];
      }
      if (option.next === "welcome") {
        pathSegments = [];
      }
      const nextNode = getChatNode(option.next);
      return {
        ...state,
        messages: [...state.messages, userMsg, { id: uid(), role: "bot", text: nextNode.botMessage }],
        currentNodeId: option.next,
        pathSegments,
        submitted: false,
        submitError: null,
      };
    }
    case "SUBMIT_TEXT": {
      const node = getChatNode(state.currentNodeId);
      if (node.type !== "text_input") return state;
      const trimmed = action.text.trim();

      if (node.fieldKey === "leadName" && !trimmed) {
        return {
          ...state,
          messages: [
            ...state.messages,
            { id: uid(), role: "bot", text: "I need your name so our team knows who to reach out to. Please type it below." },
          ],
        };
      }

      if (node.fieldKey === "leadEmail" && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return {
          ...state,
          messages: [
            ...state.messages,
            { id: uid(), role: "user", text: trimmed },
            { id: uid(), role: "bot", text: "That doesn't look like a valid email. Please try again, or press Continue to skip." },
          ],
        };
      }

      const isSkippableLead = ["leadEmail", "leadPhone", "leadNotes"].includes(node.fieldKey);
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        text: trimmed || (isSkippableLead ? "(skipped)" : "(no text)"),
      };
      const textFields = {
        ...state.textFields,
        [node.fieldKey]: trimmed,
      } as TextFieldValues;

      if (node.fieldKey === "leadPhone" && !trimmed && !textFields.leadEmail) {
        return {
          ...state,
          messages: [
            ...state.messages,
            userMsg,
            { id: uid(), role: "bot", text: "I'll need at least an email or phone number so we can reach you. What's your email?" },
          ],
          currentNodeId: "lead_email" as ChatNodeId,
          textFields,
        };
      }

      const nextNode = getChatNode(node.next);
      let botText = nextNode.botMessage;
      if (node.fieldKey === "leadName" && trimmed) {
        botText = `Thanks, ${trimmed}! What's your email? Press Continue to skip.`;
      }

      return {
        ...state,
        messages: [...state.messages, userMsg, { id: uid(), role: "bot", text: botText }],
        currentNodeId: node.next,
        textFields,
        submitted: false,
        submitError: null,
      };
    }
    default:
      return state;
  }
}

function serializeState(s: ChatbotState): string {
  return JSON.stringify({
    messages: s.messages,
    currentNodeId: s.currentNodeId,
    pathSegments: s.pathSegments,
    textFields: s.textFields,
    submitted: s.submitted,
  });
}

function parseStored(raw: string | null): Partial<ChatbotState> | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (!Array.isArray(o.messages) || typeof o.currentNodeId !== "string") return null;
    const id = o.currentNodeId as ChatNodeId;
    if (!(id in CHAT_NODES)) return null;
    return {
      messages: o.messages as ChatMessage[],
      currentNodeId: id,
      pathSegments: Array.isArray(o.pathSegments) ? (o.pathSegments as string[]) : [],
      textFields: (o.textFields as TextFieldValues) ?? {},
      submitted: Boolean(o.submitted),
    };
  } catch {
    return null;
  }
}

export function useChatbot() {
  const [state, dispatch] = useReducer(reduce, undefined, createInitialState);
  const hydrationDone = useRef(false);
  /** Skip first persist pass so we do not overwrite sessionStorage before HYDRATE applies. */
  const skipNextPersist = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined" || hydrationDone.current) return;
    hydrationDone.current = true;
    try {
      const raw = sessionStorage.getItem(CHATBOT_STORAGE_KEY);
      const partial = parseStored(raw);
      if (partial?.messages?.length) {
        dispatch({ type: "HYDRATE", payload: partial });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    try {
      sessionStorage.setItem(
        CHATBOT_STORAGE_KEY,
        serializeState({
          ...state,
          panelOpen: false,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [state.messages, state.currentNodeId, state.pathSegments, state.textFields, state.submitted]);

  const open = useCallback(() => dispatch({ type: "OPEN" }), []);
  const close = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const toggle = useCallback(() => dispatch({ type: "TOGGLE" }), []);
  const selectOption = useCallback((option: ChatOption) => {
    dispatch({ type: "CLEAR_SUBMIT_ERROR" });
    dispatch({ type: "SELECT_OPTION", option });
  }, []);
  const submitText = useCallback((text: string) => {
    dispatch({ type: "CLEAR_SUBMIT_ERROR" });
    dispatch({ type: "SUBMIT_TEXT", text });
  }, []);
  const resetConversation = useCallback(() => {
    try {
      sessionStorage.removeItem(CHATBOT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    dispatch({ type: "RESET_CONVERSATION" });
  }, []);
  const leadSuccess = useCallback(() => dispatch({ type: "LEAD_SUCCESS" }), []);
  const leadError = useCallback((message: string) => dispatch({ type: "LEAD_ERROR", message }), []);
  const clearSubmitError = useCallback(() => dispatch({ type: "CLEAR_SUBMIT_ERROR" }), []);

  const currentNode = getChatNode(state.currentNodeId);

  return {
    ...state,
    currentNode,
    open,
    close,
    toggle,
    selectOption,
    submitText,
    resetConversation,
    leadSuccess,
    leadError,
    clearSubmitError,
  };
}
