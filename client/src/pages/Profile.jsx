// const Profile = () => {
//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
//       <form className="flex flex-col gap-4">
//         <input
//           id="username"
//           type="text"
//           placeholder="username"
//           className="border p-3 rounded-xl"
//         />
//         <input
//           id="email"
//           type="email"
//           placeholder="email"
//           className="border p-3 rounded-xl"
//         />
//         <input
//           id="password"
//           type="password"
//           placeholder="password"
//           className="border p-3 rounded-xl"
//         />
//         <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
//           Update
//         </button>
//       </form>
//       <div className="flex justify-between mt-5">
//         <span className="text-red-700 cursor-pointer">Delete Account</span>
//         <span className="text-red-700 cursor-pointer">Sign out</span>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = JSON.parse(localStorage.getItem("Profile"))?.token;

      if (token) {
        try {
          const response = await Axios.get(
            "http://localhost:3001/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data) {
            setProfile(response.data);
          } else {
            console.error("Failed to fetch profile data:", response.data);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      } else {
        navigate("/Sign-in");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return <div>Loading..</div>;
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <div className="border p-4 rounded-lg">
        <p className="text-lg">
          <strong>Name:</strong> {profile.name}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {profile.email}
        </p>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
};

export default Profile;
