import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeData } from "../../Redux/PopularMoviesSlice/PopularMovies";
import type { RootState } from "../../Redux/Store";


function Home(){

  const apiKey = import.meta.env.VITE_API_KEY;
  const dispatch = useDispatch()
  const fetchedData = useSelector((state: RootState) => state.popularMovies.data)

  useEffect(() => {

    async function getTopMovies(){
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      const topMovies = data
      dispatch(storeData(topMovies))
    })
    }

    getTopMovies()
  },[])

  useEffect(() => {
    // console.log(fetchedData)
  },[fetchedData])

  return(
    <>
    </>
  )
}

export default Home