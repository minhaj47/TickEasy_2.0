"use client";

import LoadingIndicator from "@/app/loading";
import {
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Printer,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { TicketDTO, TicketResponse } from "../../../../types/ticket";

export default function TicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<TicketDTO | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}`
      );
      const data: TicketResponse = await res.json();
      if (data.success && data.ticket) setTicket(data.ticket);
    };
    fetchTicket();
  }, [id]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const original = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = original;
      window.location.reload();
    }
  };

  if (!ticket) return <LoadingIndicator />;

  const qrPayload = JSON.stringify({
    ticketIdentifier: ticket.identifier,
    qrCode: ticket.qrCode,
    buyerEmail: ticket.buyerEmail,
    buyerName: ticket.buyerName,
  });

  const event = ticket.event;
  const startDate = new Date(event.startTime);
  const day = startDate.getDate().toString().padStart(2, "0");
  const month = startDate
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen min-w-full bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div
          ref={printRef}
          className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-4 left-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md">
              {event.category}
            </div>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-700 px-4 py-2 text-sm font-medium rounded-full shadow-md">
              Ticket ID: {ticket.identifier}
            </div>
          </div>

          <div className="p-8">
            {/* Event Title and Date Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <p className="text-gray-600">
                  Presented by {event.organization.name}
                </p>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4 min-w-[80px] ml-6">
                <span className="text-2xl font-bold text-violet-700">
                  {day}
                </span>
                <span className="text-sm font-semibold text-violet-600">
                  {month}
                </span>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date & Time */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Date & Time
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {startDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700">
                    {startDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Venue</p>
                  <p className="text-gray-900 font-semibold">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Holder Information */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ticket Holder Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {ticket.buyerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-gray-900">{ticket.buyerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-gray-900">{ticket.buyerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Payment Status
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.paymentStatus.toLowerCase() === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ticket.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code and Organization Section */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <img
                  src={event.organization.logoUrl}
                  alt={`${event.organization.name} logo`}
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <p className="text-sm text-gray-500">Organized by</p>
                  <p className="font-semibold text-gray-900">
                    {event.organization.name}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Scan for entry</p>
                <QRCodeSVG value={qrPayload} />
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Please present this ticket (digital
                or printed) along with a valid ID for entry. Ticket is
                non-transferable and valid for single use only.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="mt-8 w-full flex justify-center items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Printer className="w-5 h-5" />
          Print or Download Ticket
        </button>
      </div>
    </div>
  );
}
