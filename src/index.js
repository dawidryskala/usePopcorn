import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";

import StarRaiting from "./components/StarRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <>
      <StarRaiting color="blue" onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRaiting
      maxRaiting={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRaiting size={24} color="red" className="test" defaultRating={2} /> */}

    {/* <Test /> */}
  </React.StrictMode>
);
