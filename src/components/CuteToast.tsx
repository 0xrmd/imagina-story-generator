import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
}

const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
};

const backgrounds = {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    error: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    warning: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
    info: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
};

const borders = {
    success: 'border-green-200 dark:border-green-800',
    error: 'border-red-200 dark:border-red-800',
    warning: 'border-yellow-200 dark:border-yellow-800',
    info: 'border-blue-200 dark:border-blue-800'
};

export const showToast = ({ message, type = 'info' }: ToastProps) => {
    toast.custom(
        (t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full ${backgrounds[type]} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${borders[type]}`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 pt-0.5">
                            {icons[type]}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        ),
        {
            duration: 3000,
            position: 'top-center',
            style: {
                background: 'transparent',
                padding: '0',
            },
        }
    );
};

export const successToast = (message: string) => showToast({ message, type: 'success' });
export const errorToast = (message: string) => showToast({ message, type: 'error' });
export const warningToast = (message: string) => showToast({ message, type: 'warning' });
export const infoToast = (message: string) => showToast({ message, type: 'info' }); 