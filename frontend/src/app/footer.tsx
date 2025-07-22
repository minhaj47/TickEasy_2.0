import {
  ArrowUpRight,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import TickEasyLogo from "./components/Logo";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500 to-blue-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <TickEasyLogo size={"medium"} />
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Revolutionizing event ticketing with seamless experiences,
              cutting-edge technology, and unmatched simplicity.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-violet-400" />
                <span>minhajul331047@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-violet-400" />
                <span>ikbalhasanjishan@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-violet-400" />
                <span>+8801909484884</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-violet-400" />
                <span>Sylhet, Bangladesh</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="#"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-violet-600 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-blue-500 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Explore
            </h3>
            <ul className="space-y-4">
              {[
                "Browse Events",
                "Create Event",
                "Event Analytics",
                "Mobile App",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-4">
              {[
                "Help Center",
                "Contact Us",
                "Terms of Service",
                "Privacy Policy",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-4">
              {[
                "API Documentation",
                "Event Planning Guide",
                "Best Practices",
                "Community Forum",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
    </footer>
  );
};

export default Footer;
