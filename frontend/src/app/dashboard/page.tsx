"use client";
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EventDetails } from "../../../types/event";
import { OrgDTO, OrgResponse } from "../../../types/user";
import { useAuth } from "../auth/context";
import LoadingIndicator from "../loading";

// Mock data for missing API data (revenue trend, etc.)
const mockRevenueData = [
  { month: "Jan", revenue: 3200, tickets: 95 },
  { month: "Feb", revenue: 4100, tickets: 120 },
  { month: "Mar", revenue: 3800, tickets: 110 },
  { month: "Apr", revenue: 5200, tickets: 155 },
  { month: "May", revenue: 4600, tickets: 140 },
  { month: "Jun", revenue: 6100, tickets: 180 },
];

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "indigo",
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}) => {
  const colorClasses = {
    indigo: "bg-indigo-500 text-white",
    purple: "bg-purple-500 text-white",
    emerald: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />+{change}% from last month
            </p>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

const EventCard = ({
  event,
}: {
  event: EventDetails & { status?: string; revenue?: number };
}) => {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      CONFERENCE: "bg-indigo-100 text-indigo-800",
      WORKSHOP: "bg-purple-100 text-purple-800",
      SEMINAR: "bg-cyan-100 text-cyan-800",
      COMPETITION: "bg-emerald-100 text-emerald-800",
      OTHER: "bg-amber-100 text-amber-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const soldPercentage = Math.round(
    (event.ticketCount / event.maxTickets) * 100
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-indigo-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                event.status || "upcoming"
              )}`}
            >
              {event.status}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {event.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatDate(event.startTime.toString())} •{" "}
              {formatTime(event.startTime.toString())}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">
            {event.ticketCount}
          </p>
          <p className="text-sm text-gray-500">Sold</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{event.maxTickets}</p>
          <p className="text-sm text-gray-500">Capacity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">
            ৳
            {event.revenue
              ? event.revenue.toLocaleString()
              : (event.ticketPrice || 0 * event.ticketCount).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Tickets Sold</span>
          <span>{soldPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${soldPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">
          {event.ticketPrice ? `৳${event.ticketPrice}` : "Free"}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              router.push(`/events/${event.id}`);
            }}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => {
              router.push(`/events/${event.id}/edit`);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ModernDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orgData, setOrgData] = useState<OrgDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { info } = useAuth();
  const router = useRouter();
  // Fetch organization data
  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        if (!info?.id) {
          throw new Error("User ID not found");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/org/${info?.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch organization data");
        }

        const data: OrgResponse = await response.json();

        if (!data.org) {
          setError("Organization not found");
        } else {
          setOrgData(data.org);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [info?.id]);

  // Calculate stats from real data
  const calculateStats = (org: OrgDTO) => {
    const totalEvents = org.events.length;
    const totalTickets = org.events.reduce(
      (sum, event) => sum + event.ticketCount,
      0
    );
    const totalRevenue = org.events.reduce((sum, event) => {
      return sum + (event.ticketPrice || 0) * event.ticketCount;
    }, 0);

    const now = new Date();
    const activeEvents = org.events.filter((event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      return startTime <= now && endTime >= now;
    }).length;

    return { totalEvents, totalTickets, totalRevenue, activeEvents };
  };

  // Calculate category distribution from real data
  const calculateCategoryData = (events: EventDetails[]) => {
    const categoryCount: { [key: string]: number } = {};
    const categoryColors: { [key: string]: string } = {
      CONFERENCE: "#6366f1",
      WORKSHOP: "#8b5cf6",
      SEMINAR: "#06b6d4",
      COMPETITION: "#10b981",
      MEETING: "#f59e0b",
      FESTIVAL: "#ef4444",
      EXHIBITION: "#84cc16",
      REUNION: "#f97316",
      OTHER: "#6b7280",
    };

    events.forEach((event) => {
      categoryCount[event.category] = (categoryCount[event.category] || 0) + 1;
    });

    const total = events.length;
    return Object.entries(categoryCount).map(([name, count]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value: Math.round((count / total) * 100),
      color: categoryColors[name] || "#6b7280",
    }));
  };

  // Add event status and revenue to events
  const enrichEvents = (events: EventDetails[]) => {
    const now = new Date();

    return events.map((event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);

      let status = "upcoming";
      if (startTime <= now && endTime >= now) {
        status = "ongoing";
      } else if (endTime < now) {
        status = "completed";
      }

      const revenue = (event.ticketPrice || 0) * event.ticketCount;

      return {
        ...event,
        status,
        revenue,
      };
    });
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !orgData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Failed to load dashboard</p>
          <p className="text-gray-500">{error || "Organization not found"}</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats(orgData);
  const categoryData = calculateCategoryData(orgData.events);
  const enrichedEvents = enrichEvents(orgData.events);

  const filteredEvents = enrichedEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      event.category === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex justify-between items-start pt-6 pb-4">
              {/* Back Button - Top Left */}
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>

              {/* Create Button - Top Right */}
              <button
                onClick={() => router.push("/events/create")}
                className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md flex items-center gap-2 hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
            </div>

            {/* Centered Title and Subtitle */}
            <div className="text-center py-8 pb-12">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-3">
                {orgData.name}
              </h1>
              <p className="text-indigo-200 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                Monitor your events, analyze performance, and grow your
                organization
              </p>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Mobile Header Row */}
            <div className="flex justify-between items-center py-4">
              {/* Back Button */}
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>

              {/* Create Button */}
              <button
                onClick={() => router.push("/events/create")}
                className="bg-white text-indigo-900 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
            </div>

            {/* Mobile Title Section */}
            <div className="text-center py-6 pb-10 px-2">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-2 leading-tight">
                {orgData.name}
              </h1>
              <p className="text-indigo-200 text-base sm:text-lg leading-relaxed">
                Monitor your events, analyze performance, and grow your
                organization
              </p>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-indigo-300/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={stats.totalEvents.toString()}
            change={12}
            icon={Calendar}
            color="indigo"
          />
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets.toLocaleString()}
            change={8}
            icon={Ticket}
            color="purple"
          />
          <StatCard
            title="Total Revenue"
            value={`৳${stats.totalRevenue.toLocaleString()}`}
            change={23}
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            title="Active Events"
            value={stats.activeEvents.toString()}
            change={5}
            icon={Eye}
            color="amber"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Event Categories
            </h3>
            {categoryData.length > 0 ? (
              <div className="flex items-center">
                <ResponsiveContainer width="60%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col space-y-3 ml-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700 font-medium">
                        {item.name}
                      </span>
                      <span className="text-gray-500">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No events to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Events</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="CONFERENCE">Conference</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="COMPETITION">Competition</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No events found matching your criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
