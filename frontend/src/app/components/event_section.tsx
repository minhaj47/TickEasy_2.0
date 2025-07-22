import { AlertCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { EventDTO, EventResponse } from "../../../types/event";
import LoadingIndicator from "../loading";
import EventCard from "./event_card";

const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="text-center py-12">
    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const EventsSection = () => {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [pagination, setPagination] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: "",
    search: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/all`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data: EventResponse = await response.json();

      if (data.success) {
        setEvents(data.events || []);
        // setPagination(data.pagination);
      } else {
        throw new Error(data.message || "Failed to fetch events");
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingIndicator fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} onRetry={fetchEvents} />
        </div>
      </div>
    );
  }

  return (
    <div id="events" className="relative py-24 bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-violet-50/30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-violet-100 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-violet-200">
            <Calendar className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              UPCOMING EVENTS
            </span>
          </div>

          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Discover Your Next
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Adventure
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From intimate workshops to grand celebrations, find events that
            spark your passion.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: EventDTO) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection;
