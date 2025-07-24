import { Metadata } from "next";
import EventDetailsPage from "./eventClient";

export const metadata: Metadata = {
  title: "Soulful Session with Mufti Tariq Masood",
  description: "Soulful Session with Mufti Tariq Masood",
  openGraph: {
    title: "Soulful Session with Mufti Tariq Masood",
    description: "Soulful Session with Mufti Tariq Masood",
    images: [{ url: "/slight_dark.png", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return <EventDetailsPage />;
}
