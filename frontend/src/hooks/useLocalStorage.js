import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue, expirationTime) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      if (parsedValue.expiration && Date.now() > parsedValue.expiration) {
        localStorage.removeItem(key);
        return initialValue;
      }
      return parsedValue.value;
    }
    return initialValue;
  });

  useEffect(() => {
    if (value == null) {
      localStorage.removeItem(key);
    } else {
      const expiration = expirationTime
        ? Date.now() + expirationTime
        : null;
      localStorage.setItem(key, JSON.stringify({ value, expiration }));
    }
  }, [key, value, expirationTime]);

  return [value, setValue];
};


