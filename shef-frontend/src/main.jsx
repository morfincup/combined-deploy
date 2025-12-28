import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Global styles (sizning :root theme CSS shu yerda bo'ladi)
import "./index.css";

// App-level styles (sizning App.css shu yerda bo'ladi)
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
