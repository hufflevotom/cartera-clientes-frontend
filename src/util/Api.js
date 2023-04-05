import axios from "axios";
import { backend } from "../constants/Backend";

export const httpClient = axios.create({
  baseURL: backend,
  headers: {
    "Content-Type": "application/json",
  },
});
