import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/LoginSignUp'
import Car from './Components/Car/Car'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CarDetails from './Components/Car/CarDetails';
import NewCar from './Components/Car/NewCar';
import UpdateCar from './Components/Car/updateCar';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/cars" element={<Car />} />
        <Route path="/cars/new" element={<NewCar />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/cars/:keyword" element={<Car />} />
        <Route path="/updateCar/:id" element={<UpdateCar />} />
      </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;
