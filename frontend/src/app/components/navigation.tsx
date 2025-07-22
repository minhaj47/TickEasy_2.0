import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/context";
import TickEasyLogo from "./Logo";

const Navigation = () => {
  const router = useRouter();
  const { info, logout, isLoading, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <TickEasyLogo size="small" showTagline={false} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {["Events", "Features", "FAQ"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-purple-800 font-medium transition-colors duration-200 relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-800 rounded-full animate-spin" />
            ) : isAuthenticated && info ? (
              /* Authenticated User - Minimal Profile Button */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-1 px-2 py-1.5 rounded-lg border border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-800 transition-all duration-200 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-20 truncate">
                    {info.name?.split(" ")[0] || info.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <div className="py-1">
                      {/* User Info */}
                      <div className="px-3 py-2 border-b border-gray-100">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {info.name || info.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                            {info.role === "ORGANIZER" ? "Organizer" : "User"}
                          </span>
                        </div>
                      </div>

                      {/* Dashboard Link */}
                      <button
                        onClick={() => {
                          router.push(
                            info.role === "ORGANIZER"
                              ? `/dashboard`
                              : `/user-dashboard`
                          );
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
                      >
                        {info.role === "ORGANIZER" ? "My Events" : "My Tickets"}
                      </button>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated - Simplified buttons */
              <>
                {/* Register Dropdown - Hidden on mobile, shown on desktop */}
                <div className="hidden sm:block relative group">
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-800 to-indigo-900 text-white font-medium hover:from-indigo-900 hover:to-indigo-900 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-purple-500/25">
                    Get Started
                  </button>

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    <div className="py-2">
                      <button
                        onClick={() => router.push("/auth/register-user")}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <div className="font-medium text-gray-900">
                          Register as User
                        </div>
                        <div className="text-sm text-gray-600">
                          Access your tickets later
                        </div>
                      </button>
                      <div className="border-t border-gray-200" />
                      <button
                        onClick={() => router.push("/auth/register")}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <div className="font-medium text-gray-900">
                          Register as Organizer
                        </div>
                        <div className="text-sm text-gray-600">
                          Create and manage events
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 text-sm"
                >
                  Login
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute left-0 right-0 top-16 bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {["Events", "Features", "FAQ"].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-purple-800 font-medium transition-colors duration-200 py-2"
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Mobile Auth Actions */}
              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <button
                    onClick={() => {
                      router.push("/auth/register-user");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Register as User
                  </button>
                  <button
                    onClick={() => {
                      router.push("/auth/register");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Register as Organizer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
