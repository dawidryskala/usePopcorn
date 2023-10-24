import { useEffect } from "react";
import { useState } from "react";
import StarRaiting from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // ---------- ?. optional chaning, because it could not be on the list
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // Destructuring
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  // we should always use one useEffect
  // to one thing (useEffect must have only one pu)
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      // CleanUp function
      // Clouser is really important in JS
      // it means that te functions will always remember
      // all the variables that were present ata the time
      // and the place data function was created!!
      return function () {
        document.title = "usePopcorn";
        // console.log(`Clean up effect for movie ${title}`)
      };
    },
    [title]
  );

  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              {/* if we dont need to pass anything we can write only name of function */}
              {/* When we want to pass sometning to function we need to use callback  */}
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>
                  <span>⭐</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                {!isWatched ? (
                  <>
                    <StarRaiting
                      size={"24"}
                      maxRaiting={10}
                      defaultRating={"0"}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated this movie {watchedUserRating} <span>⭐</span>
                  </p>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
