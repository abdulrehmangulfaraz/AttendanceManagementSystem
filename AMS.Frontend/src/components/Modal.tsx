import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const { theme } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Use React Portal to render outside the main layout (fixes the sidebar overlay issue)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* BACKDROP OVERLAY */}
      {/* Light Mode: Solid Dim (No Blur) | Dark Mode: Blur Effect */}
      <div
        className={`absolute inset-0 transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-black/60 backdrop-blur-sm" // Dark Mode: Nice Blur
                    : "bg-stone-900/40" // Light Mode: Clean Dim (No Blur)
                }`}
        onClick={onClose}
      ></div>

      {/* MODAL CARD */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in
                bg-white dark:bg-midnight-900 
                border border-stone-200 dark:border-midnight-800"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-midnight-800 flex justify-between items-center bg-stone-50/50 dark:bg-midnight-950/50">
          <h3 className="text-lg font-bold text-stone-800 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-midnight-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body // <--- This attaches it to the <body> tag directly
  );
};

export default Modal;
