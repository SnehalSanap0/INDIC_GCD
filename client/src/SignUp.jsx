// src/SignUp.jsx
import { useState } from "react";
import PropTypes from 'prop-types';
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "./components/ui/use-toast"

import axios from 'axios';

const nativeLanguages = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Marathi", label: "Marathi" },
  { value: "Other", label: "Other" },
];

const learningLanguages = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Marathi", label: "Marathi" },
  { value: "Other", label: "Other" },
];

const CustomDropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  isOpen,
  toggleOpen
}) => (
  <div className="relative w-full">
    <button
      type="button"
      className="w-full border rounded p-2 flex justify-between items-center"
      onClick={toggleOpen}
    >
      {selectedValue
        ? options.find(opt => opt.value === selectedValue)?.label
        : placeholder}
      <span>▼</span>
    </button>
    {isOpen && (
      <div className="absolute z-10 w-full border rounded mt-1 bg-white shadow-lg">
        {options.map((option) => (
          <div
            key={option.value}
            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
            onClick={() => {
              onSelect(option.value);
              toggleOpen();
            }}
          >
            {option.label}
            {selectedValue === option.value && <span>✓</span>}
          </div>
        ))}
      </div>
    )}
  </div>
);

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
};

const CustomCheckbox = ({
  checked,
  onChange,
  label
}) => (
  <div
    className="flex items-center space-x-2 cursor-pointer"
    onClick={onChange}
  >
    <div
      className={`w-5 h-5 border rounded ${checked ? 'bg-blue-500 text-white' : 'bg-white'
        } flex items-center justify-center`}
    >
      {checked && '✓'}
    </div>
    <label>{label}</label>
  </div>
);

CustomCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const SignUp = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); // Use the toast hook


  // State variables for form fields
  const [activeTab, setActiveTab] = useState("personal");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState("");
  const [selectedLearningLanguage, setSelectedLearningLanguage] = useState("");

  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState(false);
  const [isNativeDropdownOpen, setIsNativeDropdownOpen] = useState(false);
  const [isLearningDropdownOpen, setIsLearningDropdownOpen] = useState(false);

  const [errors, setErrors] = useState({});

  const palette = {
    lightestBlue: "#C5BAFF",
    lightBlue: "#C4D9FF",
  };

  const validatePersonalDetails = () => {
    const newErrors = {};
    if (!fullname) newErrors.fullname = "Full name is required";
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!age) newErrors.age = "Age is required";
    else if (isNaN(age) || age <= 0) newErrors.age = "Please enter a valid age";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLanguagePreferences = () => {
    const newErrors = {};
    if (!selectedNativeLanguage) newErrors.nativeLanguage = "Please select your native language";
    if (!selectedLearningLanguage) newErrors.learningLanguage = "Please select a learning language";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePersonalDetails()) {
      setActiveTab("language");
    }
  };

  const handleSignUp = async () => {
    if (!validateLanguagePreferences()) return;

    const userData = {
      fullname,
      username,
      email,
      password,
      age: parseInt(age),
      nativeLanguage: selectedNativeLanguage,
      learningLanguage: selectedLearningLanguage,
      speciallyAbled: isSpeciallyAbled,
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/signup`,
        userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.status === 201) {
        showToast({
          title: 'Signup Successful',
          description: 'Your account has been created successfully.',
          type: 'success',
        });
        navigate("/home"); // Or navigate("/login") if you prefer
      } else {
        showToast({
          title: 'Signup Failed',
          description: res.data.message || 'An error occurred during signup.',
          type: 'error',
        });
        console.log('Signup failed: ', res.data.message);
      }
    } catch (error) {
      console.log('Error during signup: ', error);
      showToast({
        title: 'Signup Failed',
        description: error.response?.data?.message || 'An error occurred during signup.',
        type: 'error',
      });
      if (error.response && error.response.data) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: "An unexpected error occurred" });
      }
    }
  };


  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      {/* <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "WickedMouse, cursive" }}>
                INDIC
              </h1>
            </Link>
          </div>
        </nav>
      </header> */}

      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Decorative background elements (optional) */}
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
          />
          <div
            className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[-30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(25.9% 44.1%, 0% 61.6%, 2.5% 26.9%, 14.5% 0.1%, 19.3% 2%, 27.5% 32.5%, 39.8% 62.4%, 47.6% 68.1%, 52.5% 58.3%, 54.8% 34.5%, 72.5% 76.7%, 99.9% 64.9%, 82.1% 100%, 72.4% 76.8%, 23.9% 97.7%, 25.9% 44.1%)",
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
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="language">Language Preferences</TabsTrigger>
            </TabsList>
            {errors.form && (
              <div className="mb-4 text-red-500 text-center">{errors.form}</div>
            )}
            <TabsContent value="personal">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                  {errors.fullname && <small className="text-red-500">{errors.fullname}</small>}
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && <small className="text-red-500">{errors.username}</small>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <small className="text-red-500">{errors.email}</small>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <small className="text-red-500">{errors.password}</small>}
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {errors.age && <small className="text-red-500">{errors.age}</small>}
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: palette.lightestBlue, cursor: "pointer" }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="language">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="native-language">Native Language</Label>
                  <CustomDropdown
                    options={nativeLanguages}
                    selectedValue={selectedNativeLanguage}
                    onSelect={setSelectedNativeLanguage}
                    placeholder="Select Native Language"
                    isOpen={isNativeDropdownOpen}
                    toggleOpen={() => setIsNativeDropdownOpen(!isNativeDropdownOpen)}
                  />
                  {errors.nativeLanguage && <small className="text-red-500">{errors.nativeLanguage}</small>}
                </div>
                <div>
                  <Label htmlFor="learning-language">Learning Language</Label>
                  <CustomDropdown
                    options={learningLanguages}
                    selectedValue={selectedLearningLanguage}
                    onSelect={setSelectedLearningLanguage}
                    placeholder="Select Learning Language"
                    isOpen={isLearningDropdownOpen}
                    toggleOpen={() => setIsLearningDropdownOpen(!isLearningDropdownOpen)}
                  />
                  {errors.learningLanguage && <small className="text-red-500">{errors.learningLanguage}</small>}
                </div>
                <div>
                  <CustomCheckbox
                    checked={isSpeciallyAbled}
                    onChange={() => setIsSpeciallyAbled(!isSpeciallyAbled)}
                    label="Specially Abled"
                  />
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: palette.lightBlue, cursor: "pointer" }}
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
                <div className="text-center mt-2">
                  <Link to="/login" className="text-sm text-blue-600 hover:underline">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SignUp;