import { Movie } from "./Movie";

export function MovieList({ movies, onSelectMovie, selectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie, i) => (
        <Movie
          movie={movie}
          key={i}
          onSelectMovie={onSelectMovie}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}
