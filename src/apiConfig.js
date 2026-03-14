const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://jlts-japanese-learning-tracker.vercel.app/';

export default API_BASE_URL;
