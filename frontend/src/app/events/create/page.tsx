"use client";

import { useAuth } from "@/app/auth/context";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Image,
  Lock,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../../toast";

const categories = [
  { value: "CONFERENCE", label: "Conference", icon: "🎯" },
  { value: "SEMINAR", label: "Seminar", icon: "📚" },
  { value: "WORKSHOP", label: "Workshop", icon: "🔧" },
  { value: "MEETING", label: "Meeting", icon: "💼" },
  { value: "COMPETITION", label: "Competition", icon: "🏆" },
  { value: "FESTIVAL", label: "Festival", icon: "🎊" },
  { value: "EXHIBITION", label: "Exhibition", icon: "🎨" },
  { value: "REUNION", label: "Reunion", icon: "👥" },
  { value: "OTHER", label: "Other", icon: "📅" },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { info } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "CONFERENCE",
    description: "",
    imageUrl: "",
    location: "",
    ticketPrice: "",
    startTime: "",
    endTime: "",
    maxTickets: "",
    isPublic: true,
    organizationId: info?.id,
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const createEvent = async (eventData: typeof formData) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    // Convert datetime-local to ISO format
    const apiData = {
      title: eventData.title,
      category: eventData.category,
      description: eventData.description,
      imageUrl: eventData.imageUrl,
      location: eventData.location || undefined,
      ticketPrice: eventData.ticketPrice
        ? parseFloat(eventData.ticketPrice)
        : 0,
      startTime: new Date(eventData.startTime).toISOString(),
      endTime: new Date(eventData.endTime).toISOString(),
      maxTickets: parseInt(eventData.maxTickets),
      isPublic: eventData.isPublic,
      organizationId: eventData.organizationId,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create event");
    }
    return result;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.imageUrl.trim()) {
      errors.imageUrl = "Image URL is required";
    } else {
      // Basic URL validation
      try {
        new URL(formData.imageUrl);
      } catch {
        errors.imageUrl = "Please enter a valid URL";
      }
    }

    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      errors.endTime = "End time is required";
    }

    if (!formData.maxTickets) {
      errors.maxTickets = "Maximum tickets is required";
    }

    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      const now = new Date();

      if (startDate <= now) {
        errors.startTime = "Start time must be in the future";
      }

      if (endDate <= startDate) {
        errors.endTime = "End time must be after start time";
      }
    }

    if (formData.maxTickets && parseInt(formData.maxTickets) <= 0) {
      errors.maxTickets = "Maximum tickets must be greater than 0";
    }

    if (formData.ticketPrice && parseFloat(formData.ticketPrice) < 0) {
      errors.ticketPrice = "Ticket price cannot be negative";
    }

    return errors;
  };

  const getInputClassName = (fieldName: string, baseClassName: string) => {
    const hasError = !!fieldErrors[fieldName];
    return `${baseClassName} ${
      hasError
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
    }`;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await createEvent(formData);
      showToast("Event created successfully!", "success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create event. Please try again.";
      showToast(errorMessage, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Create New Event</h1>
          <p className="text-xl text-indigo-100">
            Bring your community together with an amazing event
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Event Details
            </h2>
            <p className="text-gray-600 mt-2">
              Fill in the information below to create your event
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Title and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={getInputClassName(
                      "title",
                      "w-full text-gray-700 pl-12 pr-4 py-3 border rounded-lg focus:ring-2"
                    )}
                    placeholder="Enter your event title"
                  />
                </div>
                {fieldErrors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full text-gray-700 pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={getInputClassName(
                  "description",
                  "w-full text-gray-700 px-4 py-3 border rounded-lg focus:ring-2 resize-none"
                )}
                placeholder="Tell people what your event is about..."
              />
              {fieldErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Image URL and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image URL *
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className={getInputClassName(
                      "imageUrl",
                      "w-full text-gray-700 pl-12 pr-4 py-3 border rounded-lg focus:ring-2"
                    )}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {fieldErrors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.imageUrl}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full text-gray-700 pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter event location"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Price and Max Tickets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={getInputClassName(
                      "ticketPrice",
                      "w-full text-gray-700 pl-12 pr-4 py-3 border rounded-lg focus:ring-2"
                    )}
                    placeholder="0.00 (leave empty for free)"
                  />
                </div>
                {fieldErrors.ticketPrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.ticketPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Tickets *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="maxTickets"
                    value={formData.maxTickets}
                    onChange={handleChange}
                    min="1"
                    className={getInputClassName(
                      "maxTickets",
                      "w-full text-gray-700 pl-12 pr-4 py-3 border rounded-lg focus:ring-2"
                    )}
                    placeholder="100"
                  />
                </div>
                {fieldErrors.maxTickets && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.maxTickets}
                  </p>
                )}
              </div>
            </div>

            {/* Start and End Time - Made Larger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={getInputClassName(
                      "startTime",
                      "w-full text-gray-700 pl-12 pr-4 py-4 border rounded-lg focus:ring-2 text-base"
                    )}
                  />
                </div>
                {fieldErrors.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={getInputClassName(
                      "endTime",
                      "w-full text-gray-700 pl-12 pr-4 py-4 border rounded-lg focus:ring-2 text-base"
                    )}
                  />
                </div>
                {fieldErrors.endTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.isPublic ? (
                    <Globe className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      Event Visibility
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.isPublic
                        ? "Public - Anyone can find and join"
                        : "Private - Only invited people can join"}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublic: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={false}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 bg-gradient-to-r from-indigo-800 to-purple-800 hover:from-indigo-900 hover:to-purple-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Create Event
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
