import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Render Toasts Container */}
      <div className="fixed top-5 right-5 z-[100000] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center w-80 p-4 rounded-xl shadow-lg border backdrop-blur-md animate-fade-in
                        ${
                          toast.type === "success"
                            ? "bg-white/90 dark:bg-midnight-900/90 border-green-200 dark:border-green-900 text-stone-800 dark:text-white"
                            : "bg-white/90 dark:bg-midnight-900/90 border-red-200 dark:border-red-900 text-stone-800 dark:text-white"
                        }`}
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3
                            ${
                              toast.type === "success"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                                : "bg-red-100 text-red-600 dark:bg-red-900/30"
                            }`}
            >
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            {/* Text */}
            <div className="flex-1">
              <h4
                className={`text-sm font-bold ${
                  toast.type === "success"
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </h4>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
