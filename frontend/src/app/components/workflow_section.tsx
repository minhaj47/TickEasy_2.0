import { ArrowRight, Building, CheckCircle, Ticket, User } from "lucide-react";
import { useEffect, useState } from "react";

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const workflows = [
    {
      id: 1,
      title: "Quick Booking",
      subtitle: "No Registration Required",
      description:
        "Book tickets instantly and download them right away. Perfect for spontaneous plans!",
      icon: Ticket,
      color: "from-violet-400 to-indigo-400",
      steps: [
        { text: "Choose Event", icon: "🎯" },
        { text: "Select Tickets", icon: "🎫" },
        { text: "Pay & Download", icon: "⬇️" },
      ],
    },
    {
      id: 2,
      title: "Access Later",
      subtitle: "Simple Registration",
      description:
        "Register with just email & password to access all your tickets anytime, anywhere.",
      icon: User,
      color: "from-emerald-400 to-teal-400",
      steps: [
        { text: "Register Account", icon: "👤" },
        { text: "Access Dashboard", icon: "📱" },
        { text: "View All Tickets", icon: "🎪" },
      ],
    },
    {
      id: 3,
      title: "Create Events",
      subtitle: "Organization Account",
      description:
        "Register as an organization to create and manage your own events with full control.",
      icon: Building,
      color: "from-rose-400 to-pink-400",
      steps: [
        { text: "Organization Setup", icon: "🏢" },
        { text: "Create Events", icon: "✨" },
        { text: "Manage Bookings", icon: "📊" },
      ],
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-violet-900 to-indigo-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
            <CheckCircle className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-semibold text-violet-200">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Three Simple Ways
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              To Get Started
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're booking tickets on the go, managing your collection,
            or creating events - we've made it incredibly simple for everyone.
          </p>
        </div>

        {/* Main Workflow Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {workflows.map((workflow, index) => {
            const IconComponent = workflow.icon;
            const isActive = activeStep === index;

            return (
              <div
                key={workflow.id}
                className={`relative group cursor-pointer transition-all duration-700 ${
                  isActive ? "scale-105" : "hover:scale-102"
                }`}
                onClick={() => setActiveStep(index)}
              >
                {/* Card Background with Animated Border */}
                <div
                  className={`relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border transition-all duration-500 ${
                    isActive
                      ? "border-white/30 shadow-2xl"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Animated Gradient Background */}
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-20 bg-gradient-to-br ${
                      workflow.color
                    } transition-opacity duration-500 ${
                      isActive ? "opacity-30" : "group-hover:opacity-25"
                    }`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Pulse Animation */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${
                        workflow.color
                      } mb-6 transition-transform duration-300 ${
                        isActive ? "animate-pulse" : ""
                      }`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Title and Subtitle */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">
                        {workflow.title}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${workflow.color} text-white`}
                      >
                        {workflow.subtitle}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {workflow.description}
                    </p>

                    {/* Steps with Animation */}
                    <div className="space-y-3">
                      {workflow.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className={`flex items-center space-x-3 transition-all duration-300 ${
                            isActive ? "translate-x-2" : ""
                          }`}
                          style={{
                            transitionDelay: isActive
                              ? `${stepIndex * 100}ms`
                              : "0ms",
                          }}
                        >
                          <span className="text-lg">{step.icon}</span>
                          <span className="text-sm text-gray-400">
                            {step.text}
                          </span>
                          {stepIndex < workflow.steps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-600 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-2 -right-2">
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-r ${workflow.color} flex items-center justify-center animate-bounce`}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-4">
          {workflows.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index
                  ? "bg-gradient-to-r from-violet-400 to-indigo-400 scale-125"
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <button className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Start Booking Now
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-gray-400">or</span>
            <button className="px-8 py-4 border border-white/20 rounded-full font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-30 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WorkflowSection;
