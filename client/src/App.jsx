import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Suspense, lazy, useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Layout from "src/components/Layout";
import ScrollToTop from "src/components/ScrollToTop";
import LoginPage from "src/pages/Login";
import { themeSettings } from "src/providers/theme";

const HomePage = lazy(() => import("src/pages/Home"));
const PostPage = lazy(() => import("src/pages/FullPost"));
const ProfilePage = lazy(() => import("src/pages/Profile"));
const BookmarksPage = lazy(() => import("src/pages/Bookmarks"));

function App() {
  const mode = useSelector((state) => state.app.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthorized = Boolean(useSelector((state) => state.user.token));

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={isAuthorized ? <PageWrapper /> : <Navigate to="/" />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/post/:post_id" element={<PostPage />} />
              <Route path="/profile/:user_id" element={<ProfilePage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
        <ScrollToTop />
      </BrowserRouter>
    </div>
  );
}

const PageWrapper = ({}) => {
  return (
    <Suspense fallback={<Layout></Layout>}>
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  );
};

export default App;
