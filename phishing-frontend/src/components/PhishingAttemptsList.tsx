import React from "react";
import { useGetPhishingAttemptsQuery } from "../features/phishing/phishingApiSlice";
import { formatDistance } from "date-fns";

const PhishingAttemptsList: React.FC = () => {
  const { data: phishingAttempts, isLoading, isError, error } = useGetPhishingAttemptsQuery();

  // Status badge component
  const StatusBadge = ({ status }: { status: string | number | any }) => {
    // Convert status to string to handle non-string values
    const statusStr = String(status || '').toLowerCase();
    let bgColor = "";

    switch (statusStr) {
        case "sent":
        bgColor = "bg-blue-100 text-blue-800";
        break;
      case "clicked":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "failed":
        bgColor = "bg-red-100 text-red-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md ${bgColor}`}>
        {statusStr ? statusStr.charAt(0).toUpperCase() + statusStr.slice(1) : 'Unknown'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-indigo-600">Loading phishing attempts...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Error loading phishing attempts: {(error as any)?.data?.message || "Something went wrong"}
      </div>
    );
  }

  if (!phishingAttempts || phishingAttempts.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-8 rounded mb-4 text-center">
        No phishing attempts found. Create your first one!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Target Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Subject
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Sent At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Clicked At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {phishingAttempts.map((attempt) => (
            <tr key={attempt.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {attempt.targetEmail}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {attempt.emailSubject || "(No Subject)"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <StatusBadge status={attempt.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {attempt.sentAt
                  ? formatDistance(new Date(attempt.sentAt), new Date(), { addSuffix: true })
                  : "Not sent yet"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {attempt.clickedAt
                  ? formatDistance(new Date(attempt.clickedAt), new Date(), { addSuffix: true })
                  : "Not clicked"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a
                  href={`/phishing/${attempt.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhishingAttemptsList;
