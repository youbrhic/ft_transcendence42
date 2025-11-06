// import { useTranslation } from "react-i18next";

export function getType(notif: any, t: any): string {
  // const {t} = useTranslation();
  switch (notif.type) {
    case "friend_request":
      return t("friend_req");
    case "friend_request_accepted":
      return t("req_accepted");
    default:
      return t("new_msg");
  }
}

export function getNotificationColor(type: string): string {
  switch (type) {
    case "friend_request":
      return "border-l-4 border-l-sky-400 bg-gray-800";
    case "friend_request_accepted":
      return "border-l-4 border-l-emerald-500 bg-gray-800";
    case "New message":
      return "border-l-4 border-l-indigo-500 bg-gray-800";
    case "Invite":
      return "border-l-4 border-l-indigo-500 bg-gray-800";
    default:
      return "border-l-4 border-l-gray-500 bg-gray-800";
  }
}

export function formatTime(timestamp: string, t: any): string {
  const now = new Date();
  const notifTime = new Date(timestamp);
  const diffInMs = now.getTime() - notifTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  // const {t} = useTranslation();

  if (diffInMinutes < 1)
    return t("just_now");
  if (diffInMinutes < 60)
    return `${diffInMinutes}${t("m_ago")}`;
  if (diffInHours < 24)
    return `${diffInHours}${t("h_ago")}`;
  if (diffInDays < 7)
    return `${diffInDays}${t("d_ago")}`;
  return notifTime.toLocaleDateString();
}
