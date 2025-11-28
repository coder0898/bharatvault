import { createContext, useContext, useRef, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const timeoutRef = useRef(null);

  const showToast = (message, variant = "success") => {
    // Clear any previous timer so multiple toasts don't overlap
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setToast({ show: true, message, variant });

    // Automatically hide after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", variant: "" });
      timeoutRef.current = null;
    }, 3000);
  };

  const handleClose = () => {
    setToast({ show: false, message: "", variant: "" });

    // Clear pending timeout if toast is manually closed
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          bg={toast.variant}
          show={toast.show}
          onClose={handleClose}
          delay={3000}
          autohide
        >
          <Toast.Body style={{ color: "#fff" }}>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
