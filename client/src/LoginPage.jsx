import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { AuthContext } from "./utils/AuthContext";
import { useToast } from "./components/ui/use-toast"
const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast(); // Use the toast hook
  const palette = {
    lightestBlue: "#C5BAFF",
    lightBlue: "#C4D9FF",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // console.log('Attempting login with:', { username, password });
      const res = await axios.post(
        `http://localhost:3000/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        const userData = res.data.user;
        login(userData); // Update the context with user data
        showToast({
          title: 'Login Successful',
          description: 'You have been logged in successfully.',
          type: 'success',
        })
        navigate('/home'); // Redirect to the home page
      } else {
        showToast({
          title: 'Login Failed',
          description: res.data.message || 'An error occurred during login.',
          type: 'error',
        });
        console.log('Login failed: ', res.data.message);
      }
    } catch (error) {
      console.log('Error during login: ', error);
      // Optionally, display an error message to the user
      showToast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred during login.',
        type: 'error',
      });
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      {/* <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <h1
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "WickedMouse, cursive" }}
              >
                INDIC
              </h1>
            </Link>
          </div>
        </nav>
      </header> */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div className="flex justify-center items-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-[400px] bg-white p-6 rounded-xl shadow-md"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="reset">Reset Password</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: palette.lightestBlue, cursor: "pointer" }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <div className="text-center">
                  <Link to="/signup" className="text-sm text-blue-600 hover:underline">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reset">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reset-username">Username</Label>
                  <Input id="reset-username" type="text" placeholder="Enter your username" />
                </div>
                <div>
                  <Label htmlFor="reset-email">Email</Label>
                  <Input id="reset-email" type="email" placeholder="Enter your email" />
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: palette.lightBlue }}
                >
                  Reset Password
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;