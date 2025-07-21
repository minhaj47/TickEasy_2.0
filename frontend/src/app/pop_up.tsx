import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import React from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  primaryButton: {
    text: string;
    onClick: () => void;
    variant?: "primary" | "danger" | "success";
  };
  secondaryButton: {
    text: string;
    onClick: () => void;
    variant?: "secondary" | "outline";
  };
  type?: "info" | "warning" | "error" | "success";
  showCloseButton?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  primaryButton,
  secondaryButton,
  type = "info",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const getTypeIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-7 h-7 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-7 h-7 text-red-600" />;
      case "success":
        return <CheckCircle className="w-7 h-7 text-green-600" />;
      default:
        return <Info className="w-7 h-7 text-blue-600" />;
    }
  };

  const getTypeColors = () => {
    switch (type) {
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "success":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getPrimaryButtonStyle = () => {
    const variant = primaryButton.variant || "primary";
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
    }
  };

  const getSecondaryButtonStyle = () => {
    const variant = secondaryButton.variant || "secondary";
    switch (variant) {
      case "outline":
        return "border border-gray-300 text-gray-700 hover:bg-gray-50";
      default:
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className={`px-8 py-6 border-b ${getTypeColors()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getTypeIcon()}
              {title && (
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
        </div>

        {/* Footer with buttons */}
        <div className="px-8 py-6 bg-gray-50 flex space-x-4 justify-end">
          <button
            onClick={() => {
              secondaryButton.onClick();
              onClose();
            }}
            className={`px-6 py-3 rounded-lg font-medium text-base transition-colors ${getSecondaryButtonStyle()}`}
          >
            {secondaryButton.text}
          </button>
          <button
            onClick={() => {
              primaryButton.onClick();
              onClose();
            }}
            className={`px-6 py-3 rounded-lg font-medium text-base transition-colors ${getPrimaryButtonStyle()}`}
          >
            {primaryButton.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

{
  /* <Popup
  isOpen={showPopup}
  onClose={() => setShowPopup(false)}
  title="Confirm Action"
  message="Are you sure you want to delete this item? This action cannot be undone."
  type="warning"
  primaryButton={{
    text: "Delete",
    onClick: () => handleDelete(),
    variant: "danger"
  }}
  secondaryButton={{
    text: "Cancel",
    onClick: () => console.log("Cancelled"),
    variant: "outline"
  }}
/> */
}
