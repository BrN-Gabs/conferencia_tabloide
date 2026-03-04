import { useEffect, useState } from "react";
import ComparePage from "./pages/ComparePage";
import "./App.css";

type Theme = "light" | "dark";

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <div className="app-container" data-theme={theme}>
      <header className="app-topbar">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Alternar entre tema claro e escuro"
          title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        >
          <span className="sr-only">
            {theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
          </span>
          {theme === "light" ? (
            <svg
              className="theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </header>

      <ComparePage />

      <footer className="app-footer">
        &copy; Todos os direitos reservados a Bruno Gabriel da Silva
      </footer>
    </div>
  );
}

export default App;
