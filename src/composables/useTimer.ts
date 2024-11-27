export const useTimer = (initialValue: number) => {
    let value = initialValue; // Non-reactive value
    let isRunning = false; // Flag to track timer state
    let timerInterval:number | null = null; // Timer interval reference
  
    // Format time in "hh:mm" format
    const formatTime = () => {
      const hours = Math.floor(value / 60);
      const mins = value % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };
  
    // Start Timer
    const startTimer = (onUpdate: (currentValue: number) => void, onComplete: () => void) => {
      if (isRunning) return; // Prevent multiple intervals
      isRunning = true;
  
      timerInterval = setInterval(() => {
        if (value > 0) {
          value -= 1; // Decrement timer value
          onUpdate(value); // Trigger update callback with the new value
        } else {
          clearTimer(); // Stop timer when value reaches 0
          onComplete(); // Trigger completion callback
        }
      }, 60000); // Decrement every minute
    };
  
    // Clear Timer
    const clearTimer = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
      }
    };
  
    // Return public methods
    return {
      getValue: () => value,
      formatTime,
      startTimer,
      clearTimer,
    };
  };
  
