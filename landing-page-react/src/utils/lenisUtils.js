// Global Lenis instance for external access
let globalLenisInstance = null;

// Function to set global Lenis instance
export const setGlobalLenis = (instance) => {
  globalLenisInstance = instance;
};

// Function to get global Lenis instance
export const getGlobalLenis = () => globalLenisInstance;

// Function to disable/enable global Lenis
export const setLenisEnabled = (enabled) => {
  if (globalLenisInstance) {
    if (enabled) {
      globalLenisInstance.start();
    } else {
      globalLenisInstance.stop();
    }
  }
};