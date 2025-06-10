
import * as React from "react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "@radix-ui/react-toast";

const ToastContext = React.createContext();

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProviderComponent({ children }) {
  const [open, setOpen] = React.useState(false);
  const [toastContent, setToastContent] = React.useState({
    title: "",
    description: "",
    type: "success", // or 'error'
  });

  const showToast = ({ title, description, type = "success" }) => {
    setToastContent({ title, description, type });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastProvider swipeDirection="right">
        <Toast
          open={open}
          onOpenChange={(open) => setOpen(open)}
          className={`bg-${toastContent.type === 'success' ? 'green' : 'red'}-500 text-white`}
        >
          <ToastTitle>{toastContent.title}</ToastTitle>
          <ToastDescription>{toastContent.description}</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}