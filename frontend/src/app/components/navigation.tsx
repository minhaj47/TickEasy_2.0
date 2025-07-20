import { Calendar, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context";

const Navigation = () => {
  const router = useRouter();
  const { info, logout, isLoading, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-800 to-purple-600 rounded-xl flex items-center justify-center shadow-inner">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Event_Grid
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {["Events", "Features", "FAQ"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-indigo-800 font-medium transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-800 rounded-full animate-spin" />
            ) : isAuthenticated && info ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-100 text-sm text-gray-800">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">
                    {info.name || info.email}
                  </span>
                  <span className="hidden sm:inline text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md">
                    {info.role === "ORGANIZER" ? "Organizer" : "User"}
                  </span>
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() =>
                    router.push(
                      info.role === "ORGANIZER"
                        ? `/dashboard`
                        : `/user-dashboard`
                    )
                  }
                  className="px-4 py-2 rounded-lg border border-indigo-800 text-indigo-800 hover:bg-indigo-800 hover:text-white font-medium transition-colors"
                >
                  {info.role === "ORGANIZER" ? "My Events" : "My Tickets"}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Register Dropdown */}
                <div className="relative group">
                  <button className="px-4 py-2 rounded-lg border border-indigo-800 text-indigo-800 hover:bg-indigo-800 hover:text-white font-medium transition-colors">
                    Get Started
                  </button>

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    <div className="py-2">
                      <button
                        onClick={() => router.push("/auth/register-user")}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <div className="font-medium text-gray-900">
                          Register as User
                        </div>
                        <div className="text-sm text-gray-500">
                          Access your tickets later
                        </div>
                      </button>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={() => router.push("/auth/register")}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <div className="font-medium text-gray-900">
                          Register as Organizer
                        </div>
                        <div className="text-sm text-gray-500">
                          Create and manage events
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg border border-indigo-800 text-indigo-800 hover:bg-indigo-800 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
