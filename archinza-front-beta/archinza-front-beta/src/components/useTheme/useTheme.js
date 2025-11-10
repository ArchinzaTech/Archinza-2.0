import { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "theme") {
        setTheme(event.newValue || "light");
      }
    };

    const handleCustomThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "light";
      setTheme(newTheme);
    };

    // listen for both
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themeChanged", handleCustomThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChanged", handleCustomThemeChange);
    };
  }, []);

  // const isDark = theme === "dark";
  // const isLight = theme === "light";

  // console.log(theme, isDark, isLight);

  return { theme};
};

export default useTheme;
