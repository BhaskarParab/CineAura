import { Moon, Sun } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { darkToggle } from "../../Redux/DarkThemeSlice/DarkTheme"
import type { RootState } from "../../Redux/Store";


function DarkToggle(){
  
  const dispatch = useDispatch()

  const isDark = useSelector((state: RootState) => state.darkTheme.value);

  function handleToggle(){
    dispatch(darkToggle())
  }

  return(
    <>
    <div className="justify-self-center">
    {isDark ? (
        <Sun
          size={35}
          className="cursor-pointer select-none"
          style={{ color: "white" }}
          onClick={handleToggle}
        />
      ) : (
        <Moon
          size={35}
          className="cursor-pointer select-none"
          style={{ color: "black" }}
          onClick={handleToggle}
        />
      )}
      </div>
    </>
  )
}

export default DarkToggle