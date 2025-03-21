import { toast } from "sonner";
import { ToastWithIcon } from "@/components/ui/toast-with-icon";

export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    toast(<ToastWithIcon message={message} type={type} />, {
        className: `toast-${type}`,
        style: {
            fontSize: '0.925rem',
            fontWeight: 500,
            padding: '12px 16px',
        }
    });
};

export const successToast = (message: string) => showToast(message, 'success');
export const errorToast = (message: string) => showToast(message, 'error');
export const warningToast = (message: string) => showToast(message, 'warning');
export const infoToast = (message: string) => showToast(message, 'info'); 