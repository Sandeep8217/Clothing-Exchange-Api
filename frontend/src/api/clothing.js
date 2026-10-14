import {apiRequest} from "./client";

export const getClothing = () =>
    apiRequest("/clothing");

export const getMyListings = () =>
    apiRequest("/clothing/my-listings");

export const createClothing = (data) =>
    apiRequest("/clothing",
        {method: "POST", body: JSON.stringify(data)});

export const updateClothing = (id, data) =>
    apiRequest(`/clothing/${id}`,
        {method: "PUT", body: JSON.stringify(data)});

export const deleteClothing = (id) =>
    apiRequest(`/clothing/${id}`,
        {method: "DELETE"});
