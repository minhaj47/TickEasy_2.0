"use client";
import {
  BarChart3,
  CheckCircle,
  CreditCard,
  QrCode,
  Shield,
  Smartphone,
  Users,
} from "lucide-react";

const features = [
  {
    icon: <CreditCard className="w-8 h-8 text-blue-500" />,
    title: "Easy Ticket Purchase",
    description:
      "Browse, and purchase tickets for a variety of events, from concerts to conferences, all from your device with ease and convenience.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-green-500" />,
    title: "Instant Ticket Delivery",
    description:
      "Receive your tickets immediately upon purchase via email. If preferred, users can also opt to receive their tickets on WhatsApp.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
    title: "Multiple Payment Methods",
    description:
      "Enjoy flexible payment options with bKash, Nagad, Upay, Visa, Mastercard, and more, ensuring secure and smooth transactions.",
  },
  {
    icon: <QrCode className="w-8 h-8 text-orange-500" />,
    title: "Tickipass Feature",
    description:
      "Access purchased tickets instantly with Tickipass, displaying QR codes from your device, eliminating the need for printed e-ticket PDFs.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-red-500" />,
    title: "Comprehensive Dashboard",
    description:
      "Access real-time sales reports and attendance data through our user-friendly dashboard, providing valuable insights at your fingertips.",
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    title: "Smooth Scanning",
    description:
      "Streamline the entry process with our efficient ticket scanning system, ensuring a hassle-free experience for attendees and organizers.",
  },
];

const FeatureCard = ({ feature }: { feature: any }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        {feature.icon}
        <h3 className="text-xl font-semibold ml-3 text-gray-800">
          {feature.title}
        </h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </div>
  );
};
const FeaturesSection = () => {
  return (
    <div
      id="features"
      className="py-24 bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 rounded-full px-6 py-3 mb-6">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">
              POWERFUL FEATURES
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              In One Place
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
