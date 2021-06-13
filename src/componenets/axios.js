import axios from "axios";

const development = "http://localhost:8080";
const production = "https://still-garden-02215.herokuapp.com";
const url = process.env.NODE_ENV === "production" ? production : development;

axios.defaults.baseURL = `${url}`;

export default axios.create({
  baseURL: `${url}`,
  headers: {
    "Content-Type": "application/json",
  },
});
