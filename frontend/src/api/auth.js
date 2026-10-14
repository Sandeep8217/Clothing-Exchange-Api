import {apiRequest} from "./client";

export const registerUser = (data) =>
    apiRequest("/auth/register",
        {method: "POST", body: JSON.stringify(data)});

export const loginUser = (data) =>
    apiRequest("/auth/login",
        {method: "POST", body: JSON.stringify(data)});
