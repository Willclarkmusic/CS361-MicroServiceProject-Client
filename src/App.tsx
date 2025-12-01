import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/common/Header.tsx";
import Footer from "./components/common/Footer.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import GamePage from "./pages/GamePage.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import Search from "./pages/Search.tsx";
import News from "./pages/News.tsx";
import NewsArticle from "./pages/NewsArticle.tsx";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/game/:id" element={<GamePage />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsArticle />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
