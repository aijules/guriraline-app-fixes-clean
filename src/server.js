// Read the API base URL from the environment first so different deployments can override it safely.
export const server =
  process.env.REACT_APP_API_URL ||
  "https://guriraline-server-7rac.onrender.com/api/v2";

// Read the socket endpoint from the environment first so chat can use the correct realtime server per environment.
export const socketEndpoint =
  process.env.REACT_APP_SOCKET_URL ||
  "https://guriraline-socket-awo9.onrender.com";
