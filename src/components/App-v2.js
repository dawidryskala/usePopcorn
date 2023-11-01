import { useEffect } from "react";
import { useState } from "react";
import { MovieDetails } from "./MovieDetails";
import { WatchedSummary } from "./WatchedSummary";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { WatchedMoviesList } from "./WatchedMoviesList";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = process.env.REACT_APP_KEY_API;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Examples how useEffect works!!!
  /*
  useEffect(function () {
    console.log("After initial render");
  }, []);

  useEffect(function () {
    console.log("After  every render");
  });

  useEffect(
    function () {
      console.log("D");
    },
    [query]
  );
*/
  // console.log("During render");

  // to register an effect (side effect here)
  // bascically, register means that we want this code here
  // not to run as the component renders but actually
  //after it has been painted onto the screen
  // And so that's exactly what useEffect does
  // So while before, the code was executed
  // while the component was rendering
  // so while the function was being executed,
  // now this effect will actually be executed after render.
  // That the second argument we passed this empty array
  // here into useEffect. And so this means that this
  // effect will only be executed as the component first mounts

  // fetching data is a SideEffect because
  // it iteracts with world outside the component

  function handleSelectMovie(id) {
    // to your safety use callback to exclude some errors in the future
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect also called escape hatch because we are going
  // outside the React
  // Listening to a Keypress

  useEffect(
    function () {
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
      handleCloseMovie();
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
  // it will only run when this component is mount first time

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
              selectedId={selectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export function Loader() {
  return <p className="loader">Loading </p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
