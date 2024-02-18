import { useEffect, useState } from "react";

const useOnline = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(true);
        }

        const handleOfflineStatus = () => {
            setIsOnline(false);
        }

        window.addEventListener("online", handleOnlineStatus);
        window.addEventListener("offline", handleOfflineStatus);

        return () => {
            window.removeEventListener("online", handleOnlineStatus);
            window.removeEventListener("offline", handleOfflineStatus);
        }
    },[]);

    return isOnline;
}

export default useOnline;
