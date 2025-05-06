// services/profileService.js
import axios from 'axios';

export const fetchProfiles = async (token) => {
  const res = await axios.get('http://localhost:5000/api/profiles/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
