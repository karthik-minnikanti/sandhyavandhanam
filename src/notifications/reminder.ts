import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestReminderPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const hasPermission = await requestReminderPermission();
  if (!hasPermission) return;
  const kala =
    hour < 10 ? "ప్రాతః" : hour < 14 ? "మధ్యాహ్నం" : "సాయం";
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "సంధ్యావందనం",
      body: `సంధ్యావందనం – ${kala}`,
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function cancelReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
