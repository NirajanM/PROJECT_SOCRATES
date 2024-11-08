import axios from "axios";

const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://socrates-backend.onrender.com";
// const token = import.meta.env.VITE_TOKEN;

// const headers = {
//     accept: 'application/json',
//     Authorization: 'Bearer ' + token,
// };

export const fetchData = async (endroute, params) => {
  try {
    // const { data } = await axios.get(BASE_URL + endroute, { headers, params });
    const { data } = await axios.get(BASE_URL + endroute, { params });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
