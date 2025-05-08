import axiosInstance from "./axiosInstance";

export const getBooks = async (isbn: string, signal?: AbortSignal) => {
  try {
    const response = await axiosInstance.get(`/books/${isbn}`, {
      signal,
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      console.debug("Request was cancelled");
      throw new DOMException("Aborted", "AbortError");
    }

    throw new Error("Kunde inte hitta boken. Kontrollera ISBN och försök igen.");
  }
};

