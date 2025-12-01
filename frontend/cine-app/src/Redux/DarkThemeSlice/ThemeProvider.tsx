import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../Store";


function ThemeProvider({children}: {children: React.ReactNode}){

  const theme = useSelector((state: RootState) => state.darkTheme.value);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return(
    <>
    {children}
    </>
  )
}

export default ThemeProvider