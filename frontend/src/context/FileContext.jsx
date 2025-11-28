import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { getIdToken } from "firebase/auth";

const FileContext = createContext();
const API_BASE_URL = "http://localhost:5000/files";

export const FileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const firebaseUser = currentUser?.firebaseUser;
  const { showToast } = useToast();

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToken = async () => {
    if (!firebaseUser) return null;
    return await getIdToken(firebaseUser, true);
  };

  // ---- Normalize backend file → frontend display file ----
  const normalizeFile = (file) => ({
    id: file.id,
    name: file.originalName || file.name || "Untitled",
    size: file.size || "-", // backend doesn't send size
    type: file.type || "Unknown", // backend doesn't send mime, optional
    date: file.uploadedAt || file.updatedAt || new Date().toISOString(),
    shared: !!file.shareLink,
    url: file.path || null,
  });

  // ---- FETCH FILE LIST ----
  const fetchFiles = async () => {
    if (!firebaseUser) {
      setFileList([]);
      setLoading(false);
      return;
    }

    try {
      const token = await fetchToken();
      const res = await fetch(`${API_BASE_URL}/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to fetch files", "danger");
        return;
      }

      const normalized = data.files.map((f) => normalizeFile(f));
      setFileList(normalized);
    } catch (err) {
      showToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [firebaseUser]);

  // ---- UPLOAD FILE ----
  const addFile = async (meta, fileObj) => {
    if (!firebaseUser) return { success: false, message: "Not authenticated" };
    if (!fileObj) return { success: false, message: "No file selected" };

    try {
      const token = await fetchToken();
      const formData = new FormData();
      formData.append("file", fileObj);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.file) {
        return { success: false, message: data.error || "Upload failed" };
      }

      const newFile = normalizeFile(data.file);
      setFileList((prev) => [newFile, ...prev]);
      showToast("File uploaded successfully", "success");

      return { success: true, file: newFile };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ---- UPDATE FILE ----
  const updateFile = async (index, meta, fileObj) => {
    const file = fileList[index];
    if (!file?.id) return { success: false, message: "File not found" };

    try {
      const token = await fetchToken();
      const formData = new FormData();

      if (fileObj) formData.append("file", fileObj);

      const res = await fetch(`${API_BASE_URL}/update/${file.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.file) {
        return { success: false, message: data.error || "Update failed" };
      }

      const updatedFile = normalizeFile(data.file);
      setFileList((prev) =>
        prev.map((f, i) => (i === index ? updatedFile : f))
      );

      showToast("File updated successfully", "success");
      return { success: true, file: updatedFile };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ---- DELETE FILE ----
  const deleteFile = async (index) => {
    const file = fileList[index];
    if (!file?.id) return { success: false, message: "File not found" };

    try {
      const token = await fetchToken();
      const res = await fetch(`${API_BASE_URL}/delete/${file.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        return { success: false, message: data.error || "Delete failed" };

      setFileList((prev) => prev.filter((_, i) => i !== index));
      showToast("File deleted successfully", "success");
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ---- SHARE ----
  const generateShareLink = async (index) => {
    const file = fileList[index];
    if (!file?.id) return null;

    try {
      const token = await fetchToken();
      const res = await fetch(`${API_BASE_URL}/share/${file.id}/share`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.shareLink) throw new Error("Share failed");

      // URL-safe filename
      const safeFileName = encodeURIComponent(file.fileName || file.name);

      const url = `${API_BASE_URL}/shared/${data.shareLink}?fileName=${safeFileName}`;

      // Update file in state
      const updated = { ...file, shared: true, url };
      setFileList((prev) => prev.map((f, i) => (i === index ? updated : f)));

      showToast("Share link generated", "success");
      return url;
    } catch (err) {
      showToast(err.message, "danger");
      return null;
    }
  };

  return (
    <FileContext.Provider
      value={{
        fileList,
        loading,
        addFile,
        updateFile,
        deleteFile,
        generateShareLink,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => useContext(FileContext);
