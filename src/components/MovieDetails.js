import { useEffect, useRef } from "react";
import { useState } from "react";
import StarRaiting from "./StarRating";
import { KEY } from "./App";
import { Loader } from "./Loader";
import { useKey } from "./useKey";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  // we are not allow to mutate ref in render logic
  useEffect(
    function () {
      // because useEffect we also run on mount so to avoid adding one
      // when component mount first time or rerender page we use if
      if (userRating) countRef.current++;
    },
    [userRating]
  );

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

  // 161. The rules of Hooks in practice
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);
  // if (imdbRating > 8) return <p>Greatest ever!</p>;

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);

  // useEffect(
  //   function () {
  //     setIsTop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );

  const isTop = imdbRating > 8;
  console.log(isTop);

  const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRaitingDecisions: countRef.current,
    };

    onAddWatched(newMovie);
    onCloseMovie();

    // 161. More deatail of useState
    // setAvgRating(Number(imdbRating));
    // async!!! we dont get  access to the updated state right
    // after doing that, so right after we call the  state updating function

    // Callback function have access to the asyncchronism function
    // setAvgRating((x) => (x + userRating) / 2); // x current state value of avgRating
  }

  // we allow react to call the onCloseMovie later on
  useKey("Escape", onCloseMovie);

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

            {/* <p>{avgRating}</p> */}

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
