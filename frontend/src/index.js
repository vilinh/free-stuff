import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Form,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useActionData,
  useFetcher,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import App from "./App";
import { UserPage } from "./components/UserPage/UserPage";
import { AuthProvider } from "./auth.ts";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return { user: AuthProvider.username };
    },
    Component: App,
    children: [
      { index: true, Component: PublicPage },
      {
        path: "signup",
        action: signUpAction,
        Component: SignUpPage,
      },
      {
        path: "login",
        action: loginAction,
        loader: loginLoader,
        Component: LoginPage,
      },
      {
        path: "protected",
        loader: protectedLoader,
        Component: ProtectedPage,
      },
      {
        path: "profile",
        loader: protectedLoader,
        Component: UserPage,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      await AuthProvider.signout();
      return redirect("/");
    },
  },
]);

function protectedLoader({ request }) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!AuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function ProtectedPage() {
  return (
    <>
      <h3>Protected</h3>
    </>
  );
}

async function signUpLoader() {
  if (AuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return redirect("/signup");
}

async function loginLoader() {
  if (AuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

function SignUpPage() {
  let navigation = useNavigation();
  let isSigningUp = navigation.formData?.get("username") != null;

  let actionData = useActionData() | undefined;

  return (
    <div>
      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={"/login"} />
        <label>
          Username: <input name="username" />
        </label>
        <label>
          Password: <input type="password" name="password" />
        </label>
        <label>
          Reconfirm Password: <input type="password" name="confirm-pw" />
        </label>
        <button type="submit" disabled={isSigningUp}>
          {isSigningUp ? "Signing up..." : "Signup"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

function LoginPage() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get("from") || "/";

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get("username") != null;

  let actionData = useActionData() | undefined;

  return (
    <div>
      <p>You must log in to view the page at {from}</p>
      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <label>
          Username: <input name="username" />
        </label>
        <label>
          Password: <input type="password" name="password" />
        </label>
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

async function signUpAction({ request }) {
  let formData = await request.formData();
  let username = formData.get("username");
  let password = formData.get("password");
  if (!username) {
    return {
      error: "You must provide an email to sign up",
    };
  }
  if (!password) {
    return {
      error: "You must provide a password to sign up",
    };
  }

  try {
    await AuthProvider.signup(username, password);
    return redirect("/login");
  } catch (error) {
    console.log("error")
    return {
      error: "Invalid sign up attempt",
    };
  }
}

async function loginAction({ request }) {
  let formData = await request.formData();
  let username = formData.get("username");
  let password = formData.get("password");

  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }
  if (!password) {
    return {
      error: "You must provide a password to log in",
    };
  }

  try {
    await AuthProvider.signin(username, password);
  } catch (error) {
    return {
      error: "Invalid login attempt",
    };
  }
  let redirectTo = formData.get("redirectTo");
  return redirect(redirectTo || "/");
}

function PublicPage() {
  return <h3>Public</h3>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
