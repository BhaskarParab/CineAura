import Footer from "./components/Footer/Footer"
import Home from "./components/Home/Home"
import Navbar from "./components/Navbar/Navbar"
import "./Globals.css"

function App() {


  return (
    <>
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      
      <Navbar />
      <main className="grow">
        <Home/>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default App
