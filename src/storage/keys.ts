export const STORAGE_KEYS = {
  FONT_SIZE: "@sandhyavandanam/fontSize",
  LAST_SECTION_PAGE: "@sandhyavandanam/lastSectionPage",
  LAST_SECTION_TITLE: "@sandhyavandanam/lastSectionTitle",
  STREAK_COUNT: "@sandhyavandanam/streakCount",
  STREAK_LAST_DATE: "@sandhyavandanam/streakLastDate",
  INTRO_SEEN: "@sandhyavandanam/introSeen",
  HINTS_SEEN: "@sandhyavandanam/hintsSeen",
  REMINDER_ENABLED: "@sandhyavandanam/reminderEnabled",
  REMINDER_HOUR: "@sandhyavandanam/reminderHour",
  REMINDER_MINUTE: "@sandhyavandanam/reminderMinute",
  AUTO_SLIDE_ENABLED: "@sandhyavandanam/autoSlideEnabled",
} as const;

export type FontSize = "small" | "medium" | "large";
