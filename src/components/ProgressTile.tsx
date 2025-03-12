import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Car,
  User,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

interface CategoryStatus {
  name: string;
  icon: React.ReactNode;
}

export function ProgressTile() {
  const [verifiedCategories, setVerifiedCategories] = useState();
  const categories: CategoryStatus[] = [
    {
      name: "Vehicle Documents",
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: "Owner's Documents",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Tax Proof Documents",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      name: "NIF Document",
      icon: <FileSpreadsheet className="h-5 w-5" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Document Progress
          </h2>
          <div className="text-sm font-medium text-gray-600">
            {/* {verifiedCategories?.length}/4 verified */}
          </div>
        </div>
      </div>

      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
             "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Start Process
      </button>
    </div>
  );
}
