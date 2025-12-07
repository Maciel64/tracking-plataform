export type NotificationType =
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "SUCCESS"
  | "CONFIRMATION";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  confirmed?: boolean | null;
  type: NotificationType;
  createdAt: Date;
  deletedAt?: Date | null;
  userId: string;
  enterpriseId: string;
}
