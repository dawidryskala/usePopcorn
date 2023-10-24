import { average } from "./App";

export function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>
            {Number.isInteger(avgImdbRating)
              ? avgImdbRating
              : avgImdbRating.toFixed(2)}
          </span>
        </p>
        <p>
          <span>🌟</span>
          <span>
            {Number.isInteger(avgUserRating)
              ? avgUserRating
              : avgUserRating.toFixed(2)}
          </span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}
