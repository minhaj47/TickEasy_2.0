import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { EventDTO } from "../../../types/event";

const EventCard = ({ event }: { event: EventDTO }) => {
  const formatDate = (input: string | Date) => {
    const date = new Date(input);

    const day = date.getDate();
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();

    return { day, month };
  };

  const { day, month } = formatDate(event.startTime);

  return (
    <Link href={`/events/${event.id}`}>
      <div>
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.015] transition-all duration-300 overflow-hidden cursor-pointer">
          <div className="relative">
            <img
              src={
                event.imageUrl ||
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop"
              }
              alt={event.title}
              className="w-full h-48 object-cover rounded-t-2xl"
              onError={(e) => {
                console.error("Image failed to load:", event.imageUrl);
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop";
              }}
            />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md shadow">
              {event.category || "General"}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center bg-violet-100 text-violet-700 rounded-xl p-2 min-w-[56px]">
                <span className="text-lg font-extrabold">{day}</span>
                <span className="text-xs font-medium">{month}</span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                  {event.title}
                </h3>

                <div className="flex items-center text-gray-600 mb-1 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location || "Location TBD"}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(event.startTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {event.organization?.name || "Anonymous"}</span>
                  {/* <span className="text-base font-semibold text-indigo-600">
                    {event.ticketPrice ? `৳${event.ticketPrice}` : "Free"}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
