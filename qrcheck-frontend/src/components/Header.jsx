import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <header className="relative z-20 flex justify-between items-center p-4 md:p-6 bg-white shadow-md">
      <div className="logo">
        <img src={logo} alt="QRCheck Logo" className="h-8 md:h-10" />
      </div>
      <div className="flex space-x-2">
        <Link to="/login">
          <button className="cursor-pointer px-3 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50 transition font-bold">
            Login
          </button>
        </Link>
        <button className="cursor-pointer px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition font-bold">
          Criar um novo evento!
        </button>
      </div>
    </header>
  );
};

export default Header;
