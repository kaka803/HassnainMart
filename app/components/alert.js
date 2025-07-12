// components/shared/MyCenteredAlert.jsx
'use client'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function MyCenteredAlert({ title, description, type = "info", onClose }) {
  const colorMap = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
  <div
    className={`w-full max-w-md rounded-xl shadow-lg p-6 border ${colorMap[type]} transition-all duration-300`}
  >
    <Alert className="border-none  p-0 bg-transparent text-inherit ">
      <div className="flex items-start justify-between gap-4 relative">
        {/* Icon + Content */}
        <div className="flex gap-3">
          <Info className="h-6 w-6 mt-1" />
          <div>
            <AlertTitle className="text-lg font-semibold mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
  {title}
</AlertTitle>

            <AlertDescription className="text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap">
  {description}
</AlertDescription>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-xl font-bold leading-none absolute right-[-200px] md:right-[-394px] top-0 text-gray-600 hover:text-black transition"
        >
          &times;
        </button>
      </div>
    </Alert>
  </div>
</div>

  );
}
