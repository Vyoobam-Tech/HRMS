import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./app/store";

const clientId = "480016203162-m6e1a52n5ok11pbfettbht3rro0d85rn.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
