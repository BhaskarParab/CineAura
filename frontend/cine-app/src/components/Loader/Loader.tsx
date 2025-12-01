import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/Store';
import logo from "../../assets/images/android-chrome-192x192.png"
import darkLogo from "../../assets/images/dark-android-chrome-192x192.png"

const Loader = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isDark = useSelector((state: RootState) => state.darkTheme.value)

  if (!isLoading) {
    return null; // Render nothing if not loading
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-bg-primary bg-opacity-75">
      <div className="relative w-20 h-20">
        {/* Base Logo */}
        <img
          className='w-20 h-20 absolute top-0 left-0'
          src={isDark === "dark" ? logo : darkLogo}
          alt="Loading..."
        />
      </div>
      </div>
  );
};

export default Loader;