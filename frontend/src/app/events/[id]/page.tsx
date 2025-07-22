"use client";
import { useAuth } from "@/app/auth/context";
import ErrorDisplay from "@/app/error";
import LoadingIndicator from "@/app/loading";
import { useToast } from "@/app/toast";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventDTO, EventResponse } from "../../../../types/event";
import { Role } from "../../../../types/organization";
import { CreateTicketBody, TicketResponse } from "../../../../types/ticket";
interface DateFormatResult {
  day: string;
  month: string;
  weekday: string;
  fullDate: string;
}

export default function EventDetailsPage() {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState<EventDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<CreateTicketBody>>({});
  const [ticketId, setTicketId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { info, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<CreateTicketBody>({
    buyerName: info?.name || "",
    buyerEmail: info?.email || "",
    buyerPhone: "",
    paymentMethod: "",
    paymentId: "",
    isMale: undefined,
    isSustian: undefined,
  });
  const router = useRouter();
  useEffect(() => {
    const fetchEvent = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`);
        }

        const data: EventResponse = await response.json();

        if (data.success && data.event) {
          // Convert date strings to Date objects
          const eventWithDates: EventDTO = {
            ...data.event,
            startTime: new Date(data.event.startTime),
            endTime: new Date(data.event.endTime),
          };
          setEvent(eventWithDates);
        } else {
          throw new Error(data.message || "Failed to fetch event");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString: Date): DateFormatResult => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const formatTime = (dateString: Date): string => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateTicketBody> = {};

    if (!formData.buyerName.trim()) {
      errors.buyerName = "Name is required";
    }

    if (!formData.buyerEmail.trim()) {
      errors.buyerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.buyerEmail)) {
      errors.buyerEmail = "Please enter a valid email";
    }

    if (!formData.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    }

    if (
      formData.paymentMethod &&
      formData.paymentMethod !== "Cash" &&
      !formData.paymentId.trim()
    ) {
      errors.paymentId = "Payment ID is required for online payments";
    }

    if (formData.isSustian === undefined) {
      errors.isSustian = true;
    }
    if (formData.isMale === undefined) {
      errors.isMale = true;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name as keyof CreateTicketBody]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    if (isAuthenticated && info?.role == Role.ORGANIZER) {
      showToast(
        "Log out first as organizer to register for this event",
        "error"
      );
      return;
    }

    setIsRegistering(true);
    try {
      const ticketData: CreateTicketBody = {
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        paymentMethod: formData.paymentMethod,
        paymentId: formData.paymentId,
        userId: info?.id,
        isMale: formData.isMale,
        isSustian: formData.isSustian,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${eventId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticketData),
        }
      );
      const data: TicketResponse = await response.json();

      if (response.ok && data.ticketId) {
        setRegistrationSuccess(true);
        setTicketId(data.ticketId);
        setShowModal(false);
      } else {
        showToast(
          data.message || "Registration failed. Please try again.",
          "error"
        );
        console.error("Registration failed:", data.message);
      }

      // Reset form
      setFormData({
        buyerName: info?.name || "",
        buyerEmail: info?.email || "",
        buyerPhone: "",
        paymentMethod: "",
        paymentId: "",
        isMale: undefined,
        isSustian: undefined,
      });
    } catch (err) {
      console.error("Registration failed:", err);
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || "Event",
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const openRegistrationModal = (): void => {
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setFormErrors({});
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    <ErrorDisplay error={error} />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Event not found
          </h3>
          <p className="text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const { day, month, weekday, fullDate } = formatDate(event.startTime);
  const startTime: string = formatTime(event.startTime);
  const endTime: string = formatTime(event.endTime);
  const availableSeats: number = event.maxTickets - event.ticketCount;
  const isFullyBooked: boolean = availableSeats <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Home Page
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-96">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Event Badge */}
        <div className="absolute top-6 left-6">
          <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <span className="text-sm font-semibold text-violet-700">
              {event.category}
            </span>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex flex-col items-center bg-violet-100 text-violet-700 rounded-xl p-4 min-w-[80px]">
                    <span className="text-2xl font-extrabold">{day}</span>
                    <span className="text-sm font-medium">{month}</span>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {weekday}, {fullDate}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2 text-violet-600" />
                        <span>
                          {startTime} - {endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-violet-600" />
                        <span>{event.location || "Location TBD"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-2 text-violet-600" />
                        <span>{availableSeats} seats available</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Ticket className="w-5 h-5 mr-2 text-violet-600" />
                        <span className="font-semibold text-indigo-600">
                          {event.ticketPrice ? `৳${event.ticketPrice}` : "Free"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    About This Event
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Organization Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Organized by
                  </h3>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={event.organization.logoUrl}
                      alt={event.organization.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {event.organization.name}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{event.organization.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{event.organization.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.organization.address}</span>
                        </div>
                        {event.organization.websiteUrl && (
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            <a
                              href={event.organization.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-600 hover:text-violet-700 flex items-center"
                            >
                              Visit Website
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Registration */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {event.ticketPrice ? `৳${event.ticketPrice}` : "Free"}
                  </div>
                  <p className="text-gray-600">Per person</p>
                </div>

                {/* Seat availability */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Seats Available
                    </span>
                    <span className="text-sm font-bold text-violet-600">
                      {availableSeats}/{event.maxTickets}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          ((event.maxTickets - availableSeats) /
                            event.maxTickets) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.ticketCount} people already registered
                  </p>
                </div>

                {/* Registration Button */}
                {registrationSuccess && ticketId ? (
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-green-600 font-semibold mb-3 text-lg">
                      ✅ Registration Successful!
                    </div>

                    <div className="text-sm text-green-700 mb-6 leading-relaxed">
                      <p className="mb-3">
                        <strong>What happens next?</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-left max-w-md mx-auto">
                        <li>
                          Wait a few moments while we confirm your payment.
                        </li>
                        <li>
                          Once confirmed, you will receive your ticket via
                          email.
                        </li>
                        <li>
                          You can register and log in to check your tickets,
                          ticket status and download them.
                        </li>
                      </ol>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() =>
                          router.push(
                            isAuthenticated
                              ? "/user-dashboard"
                              : "/auth/register-user"
                          )
                        }
                        className="px-6 py-2 bg-white text-green-600 border border-green-600 rounded-lg font-semibold hover:bg-green-200 transition"
                      >
                        {isAuthenticated ? "Go to Dashboard" : "Register"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={openRegistrationModal}
                    disabled={isFullyBooked}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                      isFullyBooked
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {isFullyBooked ? "Event Full" : "Register Now"}
                  </button>
                )}

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <h4 className="font-semibold text-violet-800 mb-2">
                    How to confirm your seat?
                  </h4>
                  <ul className="text-sm text-violet-700 space-y-2">
                    <li>
                      • <strong>Buy your ticket</strong> - Purchase directly
                      without needing to create an account
                    </li>
                    <li>
                      • <strong>Complete payment</strong> - Finish your payment
                      and wait for confirmation
                    </li>
                    <li>
                      • <strong>Check your email</strong> - Your basic ticket
                      will be sent once payment is confirmed
                    </li>
                    <li>
                      • <strong>Create account (optional)</strong> - Register
                      and login to view all ticket details and manage bookings
                    </li>
                  </ul>
                  <h4 className="font-semibold text-violet-800 mb-2">
                    # You can buy tickets for others, but the email address
                    should be unique for each ticket.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-600">
                Register for the Event
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Payment Options */}
              <div className="mb-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <h4 className="font-semibold text-violet-800 mb-3">
                  Payment Options (Send Money)
                </h4>

                {/* Mobile Banking Numbers */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-violet-800">
                        bKash or Nagad:
                      </span>
                      <span className="text-violet-700">01638923273</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-violet-800">
                        Rocket:
                      </span>
                      <span className="text-violet-700">016389232735</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-violet-800">
                        Cellfin:
                      </span>
                      <span className="text-violet-700">01909484884</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {event.ticketPrice && event.ticketPrice > 0 && (
                  <div className="space-y-2 text-sm text-violet-700">
                    <p>
                      <strong>Step 1:</strong> Pay Tk.{event.ticketPrice} using
                      any mobile banking service above
                    </p>
                    <p>
                      <strong>Step 2:</strong> Fill up the form with your{" "}
                      <span className="font-semibold text-violet-800">
                        valid transaction ID
                      </span>
                    </p>
                    <p>
                      <strong>Step 3:</strong> Wait for payment confirmation.
                      Once confirmed we will send you a ticket via email.
                    </p>
                    <p>
                      <strong>Step 4:</strong> Register and login to check
                      status and access all your tickets
                    </p>
                  </div>
                )}

                {/* Important Note */}
                <div className="mt-3 p-2 bg-violet-100 rounded-lg">
                  <p className="text-xs text-violet-600">
                    ⚠️ <strong>Important:</strong> Please provide a valid
                    transaction ID. For Cash Payment Provide enough details for
                    easy recognition.
                  </p>
                </div>
              </div>

              {/* Registration Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
                className="space-y-4"
              >
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="buyerName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="buyerName"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      formErrors.buyerName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.buyerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.buyerName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="buyerEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="buyerEmail"
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                      formErrors.buyerEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                  />
                  {formErrors.buyerEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.buyerEmail}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="buyerPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="buyerPhone"
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleInputChange}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Gender Field */}
                <div>
                  <label
                    htmlFor="isMale"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender *
                  </label>
                  <div className="relative">
                    <select
                      id="isMale"
                      name="isMale"
                      value={
                        formData.isMale === undefined
                          ? ""
                          : formData.isMale
                          ? "true"
                          : "false"
                      }
                      onChange={handleGenderChange}
                      className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                        formErrors.isMale ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="true">Male</option>
                      <option value="false">Female</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* SUST Student Field */}
                <div>
                  <label
                    htmlFor="isSUSTian"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    From SUST? *
                  </label>
                  <div className="relative">
                    <select
                      id="isSustian"
                      name="isSustian"
                      value={
                        formData.isSustian === undefined
                          ? ""
                          : formData.isSustian
                          ? "true"
                          : "false"
                      }
                      onChange={handleGenderChange}
                      className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                        formErrors.isSustian
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select option</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                {event.ticketPrice && event.ticketPrice > 0 && (
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payment Method *
                    </label>
                    <div className="relative">
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors appearance-none bg-white ${
                          formErrors.paymentMethod
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select payment method</option>
                        <option value="bKash">💳 bKash</option>
                        <option value="Rocket">🚀 Rocket</option>
                        <option value="Nogod">📱 Nogod</option>
                        <option value="Cash">💵 Cash</option>
                        <option value="Cellfin">📞 Cellfin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.paymentMethod}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment ID for online payments */}
                {event.ticketPrice &&
                  event.ticketPrice > 0 &&
                  formData.paymentMethod && (
                    <div>
                      <label
                        htmlFor="paymentId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {formData.paymentMethod === "Cash"
                          ? "Cash Reference"
                          : "Transaction ID"}
                      </label>
                      <input
                        type="text"
                        id="paymentId"
                        name="paymentId"
                        value={formData.paymentId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                          formErrors.paymentId
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={`Enter ${
                          formData.paymentMethod === "Cash"
                            ? "To whom did you pay the money and when?"
                            : "Enter transaction ID"
                        }`}
                      />
                      {formErrors.paymentId && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.paymentId}
                        </p>
                      )}
                    </div>
                  )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `${event.ticketPrice ? `Register` : "Register for Free"}`
                  )}
                </button>
              </form>

              {/* Terms */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                By registering, you agree to our terms and conditions and
                privacy policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
