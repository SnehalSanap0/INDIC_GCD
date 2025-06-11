// src/SignUp.jsx
import { useState } from "react"; // React hook for managing component state.
import PropTypes from 'prop-types'; // For type-checking component props.
import { Link, useNavigate } from "react-router-dom"; // Link for navigation, useNavigate for programmatic navigation.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // UI components for creating tabbed interfaces.
import { Button } from "@/components/ui/button"; // UI button component.
import { Input } from "@/components/ui/input"; // UI input component.
import { Label } from "@/components/ui/label"; // UI label component.
import { useToast } from "./components/ui/use-toast"; // Custom hook for displaying toast notifications.

import axios from 'axios'; // Axios for making HTTP requests.

// Predefined list of native languages for dropdown.
const nativeLanguages = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Marathi", label: "Marathi" },
  { value: "Other", label: "Other" },
];

// Predefined list of learning languages for dropdown.
const learningLanguages = [
  { value: "Hindi", label: "Hindi" },
  { value: "English", label: "English" },
  { value: "Marathi", label: "Marathi" },
  { value: "Other", label: "Other" },
];

// CustomDropdown component for language selection.
const CustomDropdown = ({
  options, // Array of language options.
  selectedValue, // Currently selected language value.
  onSelect, // Function to call when an option is selected.
  placeholder, // Placeholder text for the dropdown.
  isOpen, // Boolean to control dropdown open/close state.
  toggleOpen // Function to toggle the dropdown open/close state.
}) => (
  <div className="relative w-full">
    {/* Dropdown button */}
    <button
      type="button"
      className="w-full border rounded p-2 flex justify-between items-center"
      onClick={toggleOpen} // Toggles dropdown visibility on click.
    >
      {/* Displays selected value's label or placeholder */}
      {selectedValue
        ? options.find(opt => opt.value === selectedValue)?.label
        : placeholder}
      <span>▼</span> {/* Dropdown arrow icon */}
    </button>
    {/* Dropdown options list, shown only when isOpen is true */}
    {isOpen && (
      <div className="absolute z-10 w-full border rounded mt-1 bg-white shadow-lg">
        {options.map((option) => (
          <div
            key={option.value} // Unique key for each option.
            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
            onClick={() => {
              onSelect(option.value); // Calls onSelect with the chosen value.
              toggleOpen(); // Closes the dropdown after selection.
            }}
          >
            {option.label} {/* Displays option label */}
            {selectedValue === option.value && <span>✓</span>} {/* Checkmark for selected option */}
          </div>
        ))}
      </div>
    )}
  </div>
);

// PropTypes for CustomDropdown to ensure correct prop types.
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

// CustomCheckbox component for the "Specially Abled" option.
const CustomCheckbox = ({
  checked, // Boolean indicating if the checkbox is checked.
  onChange, // Function to call when the checkbox state changes.
  label // Label text for the checkbox.
}) => (
  <div
    className="flex items-center space-x-2 cursor-pointer"
    onClick={onChange} // Toggles checked state on click.
  >
    <div
      className={`w-5 h-5 border rounded ${checked ? 'bg-blue-500 text-white' : 'bg-white'
        } flex items-center justify-center`}
    >
      {checked && '✓'} {/* Checkmark when checked */}
    </div>
    <label>{label}</label> {/* Checkbox label */}
  </div>
);

// PropTypes for CustomCheckbox.
CustomCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

// SignUp component - the main component for user registration.
const SignUp = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation.
  const { toast } = useToast(); // Destructure toast from useToast hook

  // State variables for form fields and UI control
  const [activeTab, setActiveTab] = useState("personal"); // Controls which tab is currently active.
  const [fullname, setFullname] = useState(""); // State for full name input.
  const [username, setUsername] = useState(""); // State for username input.
  const [email, setEmail] = useState(""); // State for email input.
  const [password, setPassword] = useState(""); // State for password input.
  const [age, setAge] = useState(""); // State for age input.

  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState(""); // State for selected native language.
  const [selectedLearningLanguage, setSelectedLearningLanguage] = useState(""); // State for selected learning language.

  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState(false); // State for "Specially Abled" checkbox.
  const [isNativeDropdownOpen, setIsNativeDropdownOpen] = useState(false); // State for native language dropdown visibility.
  const [isLearningDropdownOpen, setIsLearningDropdownOpen] = useState(false); // State for learning language dropdown visibility.

  const [errors, setErrors] = useState({}); // State for storing validation errors.

  // Color palette for consistent styling.
  const palette = {
    lightestBlue: "#C5BAFF",
    lightBlue: "#C4D9FF",
  };

  // Function to validate personal details tab fields.
  const validatePersonalDetails = () => {
    const newErrors = {}; // Object to hold new errors.
    if (!fullname) newErrors.fullname = "Full name is required";
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!age) newErrors.age = "Age is required";
    else if (isNaN(age) || age <= 0) newErrors.age = "Please enter a valid age"; // Ensures age is a positive number.
    setErrors(newErrors); // Updates error state.
    return Object.keys(newErrors).length === 0; // Returns true if no errors.
  };

  // Function to validate language preferences tab fields.
  const validateLanguagePreferences = () => {
    const newErrors = {}; // Object to hold new errors.
    if (!selectedNativeLanguage) newErrors.nativeLanguage = "Please select your native language";
    if (!selectedLearningLanguage) newErrors.learningLanguage = "Please select a learning language";
    setErrors(newErrors); // Updates error state.
    return Object.keys(newErrors).length === 0; // Returns true if no errors.
  };

  // Handler for the "Next" button in personal details tab.
  const handleNext = () => {
    if (validatePersonalDetails()) { // If personal details are valid.
      setActiveTab("language"); // Switch to the language preferences tab.
    }
  };

  // Handler for the "Sign Up" button.
  const handleSignUp = async () => {
    if (!validateLanguagePreferences()) return; // If language preferences are not valid, stop.

    // Prepare user data object for API call.
    const userData = {
      fullname,
      username,
      email,
      password,
      age: parseInt(age), // Convert age to integer.
      nativeLanguage: selectedNativeLanguage,
      learningLanguage: selectedLearningLanguage,
      speciallyAbled: isSpeciallyAbled,
    };

    try {
      // Make a POST request to the signup API endpoint.
      const res = await axios.post(
        `http://localhost:3000/api/auth/signup`,
        userData,
        {
          withCredentials: true, // Send cookies with the request.
          headers: {
            'Content-Type': 'application/json', // Specify content type.
          },
        }
      );
      if (res.status === 201) { // If signup is successful (HTTP 201 Created).
        toast({ // Display success toast.
          title: 'Signup Successful',
          description: 'Your account has been created successfully.',
          variant: 'success', // Assuming 'success' variant is defined in your toast system.
        });
        navigate("/home"); // Navigate to the home page after successful signup.
      } else {
        // Handle other successful responses (e.g., 200 OK but with a message indicating an issue)
        toast({ // Display error toast.
          title: 'Signup Failed',
          description: res.data.message || 'An error occurred during signup.',
          variant: 'destructive', // Assuming 'destructive' variant for errors.
        });
        console.log('Signup failed: ', res.data.message);
      }
    } catch (error) {
      console.log('Error during signup: ', error);
      toast({ // Display error toast for network or server errors.
        title: 'Signup Failed',
        description: error.response?.data?.message || 'An error occurred during signup.',
        variant: 'destructive',
      });
      // Set form-level errors if a response with data is available.
      if (error.response && error.response.data) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: "An unexpected error occurred" }); // Generic error message.
      }
    }
  };


  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      {/* Removed header for now */}
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
          {/* Background gradient blob 1 */}
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
          {/* Background gradient blob 2 */}
          <div
            className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[-30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(25.9% 44.1%, 0% 61.6%, 2.5% 26.9%, 14.5% 0.1%, 19.3% 2%, 27.5% 32.5%, 39.8% 62.4%, 47.6% 68.1%, 52.5% 58.3%, 54.8% 34.5%, 72.5% 76.7%, 99.9% 64.9%, 82.1% 100%, 72.4% 76.8%, 23.9% 97.7%, 25.9% 44.1%)",
            }}
          ></div>
        </div>
        <div className="flex justify-center items-center">
          {/* Tabs component for Personal Details and Language Preferences */}
          <Tabs
            value={activeTab} // Controls active tab based on state.
            onValueChange={setActiveTab} // Updates active tab state on change.
            className="w-[400px] bg-white p-6 rounded-xl shadow-md"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="language">Language Preferences</TabsTrigger>
            </TabsList>
            {/* Display form-level errors */}
            {errors.form && (
              <div className="mb-4 text-red-500 text-center">{errors.form}</div>
            )}
            {/* Content for "Personal Details" tab */}
            <TabsContent value="personal">
              <div className="space-y-4">
                {/* Full Name input */}
                <div>
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)} // Updates fullname state.
                  />
                  {errors.fullname && <small className="text-red-500">{errors.fullname}</small>} {/* Displays error message */}
                </div>
                {/* Username input */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Updates username state.
                  />
                  {errors.username && <small className="text-red-500">{errors.username}</small>}
                </div>
                {/* Email input */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Updates email state.
                  />
                  {errors.email && <small className="text-red-500">{errors.email}</small>}
                </div>
                {/* Password input */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Updates password state.
                  />
                  {errors.password && <small className="text-red-500">{errors.password}</small>}
                </div>
                {/* Age input */}
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)} // Updates age state.
                  />
                  {errors.age && <small className="text-red-500">{errors.age}</small>}
                </div>
                {/* "Next" button to proceed to language preferences */}
                <Button
                  className="w-full"
                  style={{ backgroundColor: palette.lightestBlue, cursor: "pointer" }}
                  onClick={handleNext} // Calls handleNext for validation and tab change.
                >
                  Next
                </Button>
              </div>
            </TabsContent>
            {/* Content for "Language Preferences" tab */}
            <TabsContent value="language">
              <div className="space-y-4">
                {/* Native Language dropdown */}
                <div>
                  <Label htmlFor="native-language">Native Language</Label>
                  <CustomDropdown
                    options={nativeLanguages}
                    selectedValue={selectedNativeLanguage}
                    onSelect={setSelectedNativeLanguage} // Updates selected native language.
                    placeholder="Select Native Language"
                    isOpen={isNativeDropdownOpen}
                    toggleOpen={() => setIsNativeDropdownOpen(!isNativeDropdownOpen)} // Toggles native language dropdown.
                  />
                  {errors.nativeLanguage && <small className="text-red-500">{errors.nativeLanguage}</small>}
                </div>
                {/* Learning Language dropdown */}
                <div>
                  <Label htmlFor="learning-language">Learning Language</Label>
                  <CustomDropdown
                    options={learningLanguages}
                    selectedValue={selectedLearningLanguage}
                    onSelect={setSelectedLearningLanguage} // Updates selected learning language.
                    placeholder="Select Learning Language"
                    isOpen={isLearningDropdownOpen}
                    toggleOpen={() => setIsLearningDropdownOpen(!isLearningDropdownOpen)} // Toggles learning language dropdown.
                  />
                  {errors.learningLanguage && <small className="text-red-500">{errors.learningLanguage}</small>}
                </div>
                {/* "Specially Abled" checkbox */}
                <div>
                  <CustomCheckbox
                    checked={isSpeciallyAbled}
                    onChange={() => setIsSpeciallyAbled(!isSpeciallyAbled)} // Toggles specially abled state.
                    label="Specially Abled"
                  />
                </div>
                {/* "Sign Up" button */}
                <Button
                  className="w-full"
                  style={{ backgroundColor: palette.lightBlue, cursor: "pointer" }}
                  onClick={handleSignUp} // Calls handleSignUp to submit form.
                >
                  Sign Up
                </Button>
                {/* Link to Login page */}
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

export default SignUp; // Exports the SignUp component.