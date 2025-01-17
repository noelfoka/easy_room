import { Info } from "lucide-react";
import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast toasr-top-left">
      <div className="alert p-2 text-sm shadow-lg border boeder-secondary rounded-md">
        <span className="flex items-center">
          <Info className="w-4 mr-2 font-bold text-secondary" />
          {message}
        </span>
      </div>
    </div>
  );
};

export default Notification;
