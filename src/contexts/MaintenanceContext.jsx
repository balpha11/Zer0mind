import { fetchMaintenanceSettings, saveMaintenanceSettings } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState({
    enabled: false,
    message: "",
    endTime: null,
    allowAdminAccess: false
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchMaintenanceSettings();
        setMaintenanceMode({
          enabled: settings.enabled ?? false,
          message: settings.message || "",
          endTime: settings.endTime ? new Date(settings.endTime).toISOString() : null,
          allowAdminAccess: settings.allowAdminAccess ?? false
        });
      } catch (err) {
        console.error("Failed to load maintenance settings", err);
      }
    };
    loadSettings();
  }, []);

  const updateMaintenanceMode = async (settings) => {
    setMaintenanceMode(settings);
    try {
      await saveMaintenanceSettings(settings);
    } catch (err) {
      console.error("Failed to save maintenance settings", err);
    }
  };

  return (
    <MaintenanceContext.Provider value={{ maintenanceMode, updateMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);