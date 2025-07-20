"use client";

import { Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Role } from "../../../types/organization";
import { useAuth } from "../auth/context";
import Popup from "../pop_up";

const HeroSection = () => {
  const router = useRouter();
  const { isAuthenticated, info } = useAuth();

  const [showPopUp, setShowPopUp] = useState(false);
  const [popupData, setPopupData] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const handleAccessTickets = () => {
    if (!isAuthenticated) {
      setPopupData({
        title: "Please login to access your tickets",
        message:
          "You need to log in to view your past bookings and download tickets again.\n\nYou can still book tickets without an account.",
      });
      setShowPopUp(true);
    } else if (info!.role !== Role.USER) {
      setPopupData({
        title: "Access Denied",
        message:
          "Only regular users can access tickets.\n\nPlease log in with a user account.",
      });
      setShowPopUp(true);
    } else {
      router.push("/user-dashboard");
    }
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      setPopupData({
        title: "Login Required to Create Events",
        message:
          "To create and manage events, you must log in as an organization.\n\nSign up or switch to an organizer account.",
      });
      setShowPopUp(true);
    } else if (info!.role !== Role.ORGANIZER) {
      setPopupData({
        title: "Organizer Access Required",
        message:
          "You are logged in as a user.\n\nOnly organizers can create events. Please switch to an organizer account.",
      });
      setShowPopUp(true);
    } else {
      router.push("/events/create");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 backdrop-blur-sm"></div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-8">
              <Zap className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-violet-200">
                Discover Amazing Events
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent leading-tight">
              Explore
              <br />
              <span className="text-violet-400">Upcomings!</span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dive into a universe of extraordinary events at your fingertips.
              From intimate gatherings to grand spectacles.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleAccessTickets}
                className="group bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-violet-600 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Access Your Tickets</span>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </button>

              <button
                onClick={handleCreateEvent}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Create Event</span>
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopUp && popupData && (
        <Popup
          isOpen={showPopUp}
          onClose={() => setShowPopUp(false)}
          title={popupData.title}
          message={popupData.message}
          type="warning"
          primaryButton={{
            text: "Login",
            onClick: () => router.push("/auth/login"),
            variant: "primary",
          }}
          secondaryButton={{
            text: "Cancel",
            onClick: () => setShowPopUp(false),
            variant: "outline",
          }}
        />
      )}
    </div>
  );
};

export default HeroSection;
