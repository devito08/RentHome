import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handlebtn = () => {
    setSignup(!signup);
  };

  const gotohome = () => {
    navigate("/");
  };

  const Submitdata = (e) => {
    e.preventDefault();
    console.log("Form data:", { name, email, password });

    if (signup) {
      if (!email || !password || !name) {
        alert("enter the name, password and email");
      } else {
        Axios.post("http://localhost:3001/signup", {
          name,
          email,
          password,
        })
          .then((response) => {
            if (!response.data.error) {
              console.log("Insert successful:", response.data);
              gotohome();
              toast.success("sign up success");
            } else {
              //to check user is already registered
              toast.error(`Error: ${response.data.Error}`);
            }
          })
          .catch((error) => {
            console.error("Error inserting data:", error);
          });
      }
    }

    //forlogin
    if (!signup) {
      console.log(email, password, 1);

      Axios.post("http://localhost:3001/login", {
        name,
        email,
        password,
      })
        .then((response) => {
          if (response.data && response.data.Status === "Success") {
            toast.success("Login success");

            localStorage.setItem(
              "UserDetails",
              JSON.stringify({ name: response.data.name, email, password })
            );

            localStorage.setItem(
              "Profile",
              JSON.stringify({ token: response.data.token })
            );
            navigate("/");
          } else {
            toast.error(`Error: ${response.data.Error}`);
          }
        })
        .catch((error) => {
          console.error("Error inserting data:", error);
        });
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        {" "}
        {signup ? <h1>SignUp</h1> : <h1>Login</h1>}
      </h1>
      <form className="flex flex-col gap-4 " onSubmit={Submitdata}>
        {signup && (
          <input
            type="text"
            placeholder="username"
            id="username"
            className="border p-3 rounded-lg"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        )}
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {signup ? "SignUp" : "SignIn"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>{signup ? "Already have an account" : "Dont have an account"}?</p>
        <button type="button" onClick={handlebtn} className="text-blue-700">
          {signup ? "Signin" : "Signup"}
        </button>
        {/* {loginStatus && <button onClick={userauth}>Check</button>} */}
      </div>
    </div>
  );
};

export default SignUp;
