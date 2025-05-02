import { CreatePhishingAttemptRequest } from "../../models/createPhishingAttemptRequest";
import { PhishingAttempt } from "../../models/phishingAttempt";
import { apiSlice } from "../api/apiSlice";

export const phishingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all phishing attempts
    getPhishingAttempts: builder.query<PhishingAttempt[], void>({
      query: () => ({
        url: "/phishing-attempts",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PhishingAttempt" as const, id })),
              { type: "PhishingAttempt", id: "LIST" },
            ]
          : [{ type: "PhishingAttempt", id: "LIST" }],
    }),

    // Get a single phishing attempt by ID
    getPhishingAttemptById: builder.query<PhishingAttempt, string>({
      query: (id) => ({
        url: `/phishing-attempts/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PhishingAttempt", id }],
    }),

    // Create a new phishing attempt
    createPhishingAttempt: builder.mutation<PhishingAttempt, CreatePhishingAttemptRequest>({
      query: (newAttempt) => ({
        url: "/phishing-attempts",
        method: "POST",
        body: newAttempt,
      }),
      invalidatesTags: [{ type: "PhishingAttempt", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPhishingAttemptsQuery,
  useGetPhishingAttemptByIdQuery,
  useCreatePhishingAttemptMutation,
} = phishingApiSlice;
