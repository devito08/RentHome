import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import profile from "../assets/profile.png";

const Header = () => {
  const navigate = useNavigate();

  // const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   const storedUserData = localStorage.getItem("UserDetails");
  //   if (storedUserData) {
  //     setUserData(JSON.parse(storedUserData));
  //   } else {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       Axios.get("https://hestate-backend.onrender.com/isAuth", {
  //         headers: {
  //           "x-access-token": token,
  //         },
  //       })
  //         .then((response) => {
  //           if (response.data.auth) {
  //             const userData = response.data.userData;
  //             setUserData(userData);
  //             localStorage.setItem("userDetails", JSON.stringify(userData));
  //           } else {
  //             console.error("Authentication failed");
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("An unexpected error occurred:", error.message);
  //         });
  //     }
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("Profile");
    localStorage.removeItem("UserDetails");
    navigate("/login");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const token = JSON.parse(localStorage.getItem("Profile"));

  const checkAuthenticationAndFetchProfile = () => {
    console.log(token);
    if (token) {
      Axios.get("http://localhost:3001/verifyToken", {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
        .then((response) => {
          // If token is valid, set isLoggedIn to true
          setIsLoggedIn(true);
          // Fetch profile data
          Axios.get("http://localhost:3001/singleUser", {
            headers: { Authorization: `Bearer ${token.token}` },
          })
            .then((response) => {
              // Set profile data in state
              setProfileData(response.data);
            })
            .catch((error) => {
              console.error("Error fetching profile data:", error);
            });
        })
        .catch((error) => {
          // If token is invalid, log out user and remove token from local storage
          setIsLoggedIn(false);
          localStorage.removeItem("Profile");
          localStorage.removeItem("UserDetails");
          // Clear profile data
          setProfileData(null);
        });
    } else {
      // If no token found, set isLoggedIn to false and clear profile data
      setIsLoggedIn(false);
      setProfileData(null);
    }
  };

  console.log(profileData);

  useEffect(() => {
    checkAuthenticationAndFetchProfile();
  }, []);
  console.log(profileData, "Navbar");

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Rent</span>
            <span className="text-slate-700">Home</span>
          </h1>
        </Link>
        <p className="text-slate-700 text-sm sm:text-base font-bold">
          Discover, Buy, and Sell with Us
        </p>
        <ul className="flex gap-6 items-center">
          <Link to="/">
            <li className="hidden sm:inline hover:underline text-slate-700">
              Home
            </li>
          </Link>
          <Link to="/About">
            <li className="hidden sm:inline hover:underline text-slate-700">
              About
            </li>
          </Link>
          <Link to="/profile">
            <li className="hover:underline text-slate-700">Profile</li>
          </Link>
          <li className="pr-8">
            {isLoggedIn ? (
              <button
                className="text-white hover:text-gray-300 font-bold"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link to="/Sign-in">
                <button className="hover:underline text-slate-700">
                  SignIn
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
