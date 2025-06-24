const API_URL = "https://security-threat-backend.onrender.com";

export const uploadService = {
  uploadProfilePicture: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload/profile-picture`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    // Return the filename as required by the backend
    return data.filename;
  },
};

export default uploadService; 