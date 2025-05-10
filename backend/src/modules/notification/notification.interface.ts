export interface NotificationUserToNotify {
  deviceId: string;
}

export interface NotificationParams {
  usersToNotify: NotificationUserToNotify[];
  title: string;
  body: string;
  data?: Record<string, any>;
}