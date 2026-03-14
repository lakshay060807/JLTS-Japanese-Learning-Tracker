const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://jlts-japanese-learning-tracker-uo56.vercel.app/'; // Updated production URL

export default API_BASE_URL;
