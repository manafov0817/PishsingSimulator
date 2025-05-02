// Environment configuration
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  dotnetApiUrl: import.meta.env.VITE_DOTNET_API_URL || 'http://localhost:5000',
};

export default config;
