"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "error";
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    setToasts((prev) => [...prev, { ...item, id: Math.random().toString(36).slice(2) }]);
  }, []);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider swipeDirection="right">
        {toasts.map((t) => (
          <Toast.Root
            key={t.id}
            open
            onOpenChange={(open) => !open && dismiss(t.id)}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border max-w-sm ${
              t.variant === "error"
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex-1">
              <Toast.Title className="text-sm font-semibold text-gray-900">{t.title}</Toast.Title>
              {t.description && (
                <Toast.Description className="text-xs text-gray-500 mt-0.5">
                  {t.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-50" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
