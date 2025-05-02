import React, { useState } from "react";
import { useCreatePhishingAttemptMutation } from "../features/phishing/phishingApiSlice";

const CreatePhishingAttemptForm: React.FC = () => {
  const [targetEmail, setTargetEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createPhishingAttempt, { isLoading }] = useCreatePhishingAttemptMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Clear any previous messages
      setSuccessMessage("");
      setErrorMessage("");

      // Call the API to create a new phishing attempt
      await createPhishingAttempt({
        targetEmail,
        emailSubject,
        emailContent,
      }).unwrap();

      // Show success message and reset form
      setSuccessMessage("Phishing attempt created successfully!");
      setTargetEmail("");
      setEmailSubject("");
      setEmailContent("");
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message || "Failed to create phishing attempt. Please try again."
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-6">Create New Phishing Attempt</h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetEmail">
            Target Email*
          </label>
          <input
            id="targetEmail"
            type="email"
            placeholder="user@example.com"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailSubject">
            Email Subject*
          </label>
          <input
            id="emailSubject"
            type="text"
            placeholder="Important: Security Update Required"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailContent">
            Email Content*
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Use {"{{trackingUrl}}"} in your content to insert a tracking link.
          </p>
          <textarea
            id="emailContent"
            placeholder={
              "Dear user, we've detected suspicious activity on your account. Please click {{trackingUrl}} to verify your account."
            }
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            required
            rows={6}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Phishing Attempt"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePhishingAttemptForm;
