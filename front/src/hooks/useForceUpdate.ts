import { useState } from 'react';

/**
 * Custom hook that returns a function to force component re-render
 * 
 * @returns Function to trigger component update
 */
export const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue(value => value + 1);
}; 