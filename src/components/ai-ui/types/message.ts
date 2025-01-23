import { Message } from "ai";
import { ComponentPropsWithoutRef } from "react";

export interface MessageItemProps {
  role: Message["role"];
  content: string;
  createdAt?: Date;
  onRetry?: () => void;
}

export type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  isUser?: boolean;
};
