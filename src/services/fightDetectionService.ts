import axios from 'axios';


const FIGHT_DETECTION_API_URL = 'http://localhost:8000/predict';

export const detectFight = async (formData: FormData, threshold = 0.5) => {
  const response = await axios.post(
    `${FIGHT_DETECTION_API_URL}?threshold=${threshold}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}; 