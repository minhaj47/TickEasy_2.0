"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Ticket,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { TicketDTO } from "../../../types/ticket";
import { UserDTO, UserResponse } from "../../../types/user";
import { useAuth } from "../auth/context";
import LoadingIndicator from "../loading";
import { useToast } from "../toast";
export default function UserDashboard() {
  const router = useRouter();
  const { info, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQrModel, setShowQrModel] = useState<TicketDTO | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      showToast("Please login first to access your tickets", "info");
      router.push("/auth/login");
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      console.log(info);
      setLoading(true);

      const response = await fetch(
        `http://localhost:5001/api/users/${info?.id}`
      );
      const data: UserResponse = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user data");
      }

      if (data.user) {
        setUserData(data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getQrPayload = (ticket: TicketDTO) => {
    return JSON.stringify({
      ticketIdentifier: ticket.identifier,
      qrCode: ticket.qrCode,
      buyerEmail: ticket.buyerEmail,
      buyerName: ticket.buyerName,
    });
  };

  const formatTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No User Data Found
          </h2>
          <p className="text-gray-600">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16 shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-4">
            <User className="w-12 h-12 text-indigo-200" />
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                Welcome Back!
              </h1>
              <p className="text-lg text-indigo-100 mt-1">{userData.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-indigo-200">
            <div className="flex items-center space-x-2">
              <Ticket className="w-5 h-5" />
              <span>{userData.tickets.length} Tickets</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Member since {formatDate(userData.createdAt)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {userData.tickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Tickets Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't purchased any tickets yet. Start exploring events!
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">My Tickets</h2>
              <div className="text-sm text-gray-600">
                {userData.tickets.length} ticket
                {userData.tickets.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid gap-6">
              {userData.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="md:flex">
                    {/* Event Image */}
                    <div className="md:w-1/3">
                      <div className="h-48 md:h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                        {ticket.event.imageUrl ? (
                          <img
                            src={ticket.event.imageUrl}
                            alt={ticket.event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Calendar className="w-16 h-16 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {ticket.event.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(ticket.event.startTime)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(ticket.event.startTime)} -{" "}
                                {formatTime(ticket.event.endTime)}
                              </span>
                            </div>
                          </div>
                          {ticket.event.location && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
                              <MapPin className="w-4 h-4" />
                              <span>{ticket.event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              ticket.paymentStatus
                            )}`}
                          >
                            {ticket.paymentStatus}
                          </div>
                          {ticket.checkedIn ? (
                            <div className="flex items-center space-x-1 text-green-600 mt-2 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Checked In</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-500 mt-2 text-sm">
                              <XCircle className="w-4 h-4" />
                              <span>Not Checked In</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ticket Info */}
                      <div className="border-t pt-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Ticket className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {ticket.identifier}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {ticket.buyerName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {ticket.paymentMethod}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {ticket.buyerEmail}
                              </span>
                            </div>
                            {ticket.buyerPhone && (
                              <div className="flex items-center space-x-2 mb-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {ticket.buyerPhone}
                                </span>
                              </div>
                            )}
                            {ticket.event.ticketPrice && (
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">
                                  ${ticket.event.ticketPrice}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 mt-4 pt-4 border-t">
                          <button
                            onClick={() => setShowQrModel(ticket)}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>View QR Code</span>
                          </button>
                          <button
                            onClick={() => {
                              router.push(`/events/${ticket.event.id}`);
                            }}
                            className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                          >
                            <span>Event Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {showQrModel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Close Button */}
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={() => setShowQrModel(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 pt-2 text-center">
              {/* Large QR Code */}
              <div className="mb-6">
                {showQrModel.qrCode ? (
                  <div className="flex justify-center">
                    <QRCodeSVG value={getQrPayload(showQrModel)} size={240} />
                  </div>
                ) : (
                  <div className="w-60 h-60 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Floating Info Badge */}
              <div className="bg-white mb-5 shadow-lg rounded-full px-4 py-2 border border-gray-200">
                <p className="text-xs font-medium text-gray-600">
                  Ticket ID:{" "}
                  <span className="text-violet-600 font-bold">
                    {showQrModel.identifier}
                  </span>
                </p>
              </div>

              {/* View Full Ticket Button */}
              <button
                onClick={() => {
                  router.push(`/tickets/${showQrModel.id}`);
                }}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>View Full Ticket</span>
              </button>
            </div>
          </div>

          {/* Background Click to Close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowQrModel(null)}
          />
        </div>
      )}
    </div>
  );
}
