import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface ToastWithIconProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

const icons = {
    success: <CheckCircle2 className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />
};

export const ToastWithIcon: React.FC<ToastWithIconProps> = ({ message, type }) => {
    return (
        <div className="flex items-center gap-2">
            {icons[type]}
            <span>{message}</span>
        </div>
    );
}; 