export interface NotificationUserToNotify {
  deviceId: string;
  userId: string;
  email?: string;
}

export interface NotificationParams {
  usersToNotify: NotificationUserToNotify[];
  title: string;
  body: string;
  data?: Record<string, any>;
}