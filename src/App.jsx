import './App.css';
import LoadingAnimation from './Components/Loading';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading } from './Redux/Slice/loadingSlice';
import Routing from './Routing/Routing';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);

  // Automatically hide loading after 2.5 seconds (you can adjust time)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideLoading());
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <>
      <Routing/>
    </>
  );
}

export default App;
