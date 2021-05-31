import axios from "axios"

const apiSr = axios.create({
  baseURL: `http://api.sr.se/api/v2`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

export default apiSr
