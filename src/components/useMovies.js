import { useEffect, useState } from "react";
export const KEY = process.env.REACT_APP_KEY_API;

// export name for custom hooks

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect also called escape hatch because we are going
  // outside the React
  // Listening to a Keypress

  useEffect(
    function () {
      // optional chaining ?.
      //   callback?.();

      // it have nothing to do with react but with the browser API
      // like the fetch function
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); // every single fetch we need to reset error
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            // it is not really important to know how race condition works
            // but the most important to fallow receipe
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          // this block of code will be executed every time at the end
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // Every time when you type we want to close MovieDetail
      fetchMovies();

      // CleanUp function
      return function () {
        // abort anulować
        controller.abort();
      };

      // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
      //   .then((res) => res.json())
      //   .then((data) => setMovies(data.Search));
      //   );
    },
    [query]
  );

  return { movies, isLoading, error };
}
