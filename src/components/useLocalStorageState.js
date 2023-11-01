import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // const [value, setValue] = useState([]);
  // it will use at the initial value the localStorage items which we earlier added
  // before reloading page. It must be pure function
  // rememeber that the localStorage store data like a string
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // The JSON.parse() static method parses a JSON string,
    // constructing the JavaScript value or object described by the string
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      // localStorage can store only key pair value (strings)
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
