export function Movie({ movie, onSelectMovie, selectedId }) {
  function handleClick(id) {
    onSelectMovie(id);
  }

  return (
    <li key={movie.imdbID} onClick={() => handleClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
