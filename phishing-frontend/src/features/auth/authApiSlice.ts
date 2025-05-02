import { LoginRequest } from "../../models/loginRequest";
import { LoginResponse } from "../../models/loginResponse";
import { RegisterRequest } from "../../models/registerRequest";
import { User } from "../../models/user";
import { apiSlice } from "../api/apiSlice";
import { setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Raw login response:", data);

          // Process response and normalize token location if needed
          let userData: LoginResponse;

          // Check for token in different possible locations
          const token = data.token || data.access_token || data.accessToken || "";

          if (!token) {
            console.error("Could not find token in response:", data);
            return;
          }

          // If data is not already in expected format, create proper structure
          if (typeof data === "string" || !data.user) {
            // If response is just a token or doesn't have user object
            userData = {
              token: typeof data === "string" ? data : token,
              user: { id: "unknown", email: _arg.email },
            };
          } else {
            // Normal case - response has user and token
            userData = {
              ...data,
              token,
            };
          }

          // Store in Redux
          dispatch(setCredentials(userData));
        } catch (error) {
          console.error("Login error in onQueryStarted:", error);
        }
      },
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserProfileQuery } = authApiSlice;
