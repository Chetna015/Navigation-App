export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000`;
    }
  }
  return 'http://localhost:5000';
};
