import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQItem = ({
  faq,
  index,
  isExpanded,
  onToggle,
}: {
  faq: any;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => onToggle(index)}
        className="w-full px-0 py-5 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors group"
      >
        <span className="text-base font-medium text-gray-800 group-hover:text-gray-900 transition-colors pr-4">
          {faq.question}
        </span>
        <div
          className={`transition-transform duration-300 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="pb-5 animate-fadeIn">
          <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

// FAQ Illustration Component
const FAQIllustration = () => {
  return (
    <div className="relative">
      {/* Main FAQ Cards */}
      <div className="relative">
        {/* Back Card (Teal) */}
        <div className="absolute top-8 left-8 w-48 h-64 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-xl transform rotate-6">
          <div className="p-6 text-white">
            <div className="text-6xl font-bold opacity-60 mb-4">FAQ</div>
            <div className="space-y-2">
              <div className="w-3/4 h-2 bg-white/30 rounded"></div>
              <div className="w-1/2 h-2 bg-white/30 rounded"></div>
              <div className="w-2/3 h-2 bg-white/30 rounded"></div>
            </div>
          </div>
        </div>

        {/* Front Card (Lime Green) */}
        <div className="relative w-48 h-64 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl shadow-2xl transform -rotate-3">
          <div className="p-6 text-gray-800">
            <div className="text-7xl font-bold mb-6 text-gray-700">?</div>
            <div className="space-y-2">
              <div className="w-3/4 h-2 bg-gray-600/30 rounded"></div>
              <div className="w-1/2 h-2 bg-gray-600/30 rounded"></div>
              <div className="w-2/3 h-2 bg-gray-600/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full shadow-md animate-bounce"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full shadow-md animate-pulse"></div>
      <div className="absolute top-1/2 -right-6 w-4 h-4 bg-pink-400 rounded-full shadow-sm"></div>
    </div>
  );
};

// FAQ Section Component
const FAQSection = ({ faqs }: { faqs: any }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div id="faq" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left Side - Illustration */}
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <FAQIllustration />
          </div>

          {/* Right Side - FAQ Content */}
          <div className="lg:col-span-3">
            <div className="mb-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                FAQs
              </h2>
            </div>

            <div className="space-y-0">
              {faqs.map((faq: any, index: number) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  isExpanded={expandedFAQ === index}
                  onToggle={toggleFAQ}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample FAQ data
const sampleFAQs = [
  {
    question: "I can't access the email of my Tickify account. What to do?",
    answer:
      "If you can't access your email, please contact our support team with your account details and they will help you regain access to your account.",
  },
  {
    question: "How can I cancel my ticket?",
    answer:
      "Ticket cancellation depends on the event organizer's policy. Please check the event details for cancellation terms or contact the organizer directly.",
  },
  {
    question: "What if the event is cancelled?",
    answer:
      "If an event is cancelled, you will receive a full refund automatically. The refund will be processed within 5-7 business days to your original payment method.",
  },
  {
    question: "Can I transfer my ticket to someone else?",
    answer:
      "Ticket transfers are subject to the event organizer's policy. Some events allow transfers while others don't. Please check the event details for transfer policies.",
  },
];

export default function TickifyFAQSection() {
  return <FAQSection faqs={sampleFAQs} />;
}
