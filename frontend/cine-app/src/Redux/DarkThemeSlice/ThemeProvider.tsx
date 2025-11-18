import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../Store";


function ThemeProvider({children}: {children: React.ReactNode}){

  const isDark = useSelector((state: RootState) => state.darkTheme.value);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return(
    <>
    {children}
    </>
  )
}

export default ThemeProvider