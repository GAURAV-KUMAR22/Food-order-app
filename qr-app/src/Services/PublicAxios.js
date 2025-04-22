import axios from "axios";
console.log(import.meta.env.VITE_BACKEND_URL)
const publicAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    }
});

// publicAxios.interceptors.request.use(
//     (config) => {

//     }
// )

export default publicAxios;
