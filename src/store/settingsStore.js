import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      // Theme settings
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Notification settings
      emailNotifications: true,
      desktopNotifications: true,
      soundEnabled: true,
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setDesktopNotifications: (enabled) => set({ desktopNotifications: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      // Chat settings
      enterToSend: true,
      autoScroll: true,
      showTimestamps: true,
      setEnterToSend: (enabled) => set({ enterToSend: enabled }),
      setAutoScroll: (enabled) => set({ autoScroll: enabled }),
      setShowTimestamps: (enabled) => set({ showTimestamps: enabled }),

      // AI Assistant settings
      responseLength: 2,
      aiPersonality: 'professional',
      autoSuggestions: true,
      setResponseLength: (length) => set({ responseLength: length }),
      setAiPersonality: (personality) => set({ aiPersonality: personality }),
      setAutoSuggestions: (enabled) => set({ autoSuggestions: enabled }),

      // Language settings
      language: 'english',
      setLanguage: (language) => set({ language }),

      // Reset all settings to default
      resetSettings: () => set({
        theme: 'system',
        emailNotifications: true,
        desktopNotifications: true,
        soundEnabled: true,
        enterToSend: true,
        autoScroll: true,
        showTimestamps: true,
        responseLength: 2,
        aiPersonality: 'professional',
        autoSuggestions: true,
        language: 'english'
      })
    }),
    {
      name: 'zeromind-settings',
      version: 1,
    }
  )
);

export default useSettingsStore; 