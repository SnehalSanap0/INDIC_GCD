import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

// Defines the available native languages for selection
const nativeLanguages = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "marathi", label: "Marathi" },
  // Add more languages here
];

// Defines the available learning languages for selection
const learningLanguages = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  // Add more languages here
];

const Login = () => {
  // State to manage the selected native language
  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState("");
  // State to manage the selected learning language
  const [selectedLearningLanguage, setSelectedLearningLanguage] = useState("");
  // State to manage the "Specially Abled" checkbox
  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState(false);

  // Defines a color palette for consistent styling
  const palette = {
    lightestBlue: "#C5BAFF",
    lightBlue: "#C4D9FF",
  };

  return (
    // Main container with a gradient background and centered content
    <div className="bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] min-h-screen flex items-center justify-center">
      {/* Header section */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">WickedMouse</span>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "WickedMouse, cursive" }}>
                INDIC
              </h1>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content area */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="flex justify-center items-center">
          {/* Tabs component for Login and Language Preferences */}
          <Tabs defaultValue="login" className="w-[400px] bg-white p-6 rounded-xl shadow-md">
            {/* Tab list for navigation between "Personal Details" and "Language Preferences" */}
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Personal Details</TabsTrigger>
              <TabsTrigger value="signup">Language Preferences</TabsTrigger>
            </TabsList>

            {/* Content for the "Personal Details" tab */}
            <TabsContent value="login">
              <div className="space-y-4">
                {/* Name input field */}
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" />
                </div>
                {/* Username input field */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" placeholder="Choose a username" />
                </div>
                {/* Age input field */}
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                {/* Password input field */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>
                {/* "Next" button to switch to the "Language Preferences" tab */}
                <Button 
                  className="w-full" 
                  style={{ backgroundColor: palette.lightestBlue }} 
                  onClick={() => document.querySelector('[value="signup"]').click()}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Content for the "Language Preferences" tab */}
            <TabsContent value="signup">
              <div className="space-y-4">
                {/* Native Language selection using Popover and Command components */}
                <div>
                  <Label htmlFor="native-language">Native Language</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedNativeLanguage ? nativeLanguages.find(lang => lang.value === selectedNativeLanguage)?.label : "Select Native Language"}
                        <ChevronsUpDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {nativeLanguages.map((language) => (
                              <CommandItem
                                key={language.value}
                                onSelect={() => {
                                  setSelectedNativeLanguage(language.value);
                                }}
                              >
                                {language.label}
                                <Check className={selectedNativeLanguage === language.value ? "opacity-100 ml-auto" : "opacity-0"} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Learning Language selection using Popover and Command components */}
                <div>
                  <Label htmlFor="learning-language">Learning Language</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedLearningLanguage ? learningLanguages.find(lang => lang.value === selectedLearningLanguage)?.label : "Select Learning Language"}
                        <ChevronsUpDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {learningLanguages.map((language) => (
                              <CommandItem
                                key={language.value}
                                onSelect={() => {
                                  setSelectedLearningLanguage(language.value);
                                }}
                              >
                                {language.label}
                                <Check className={selectedLearningLanguage === language.value ? "opacity-100 ml-auto" : "opacity-0"} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* "Specially Abled" checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="specially-abled" 
                    checked={isSpeciallyAbled} 
                    onCheckedChange={setIsSpeciallyAbled} // Use onCheckedChange for Checkbox component
                  />
                  <Label htmlFor="specially-abled">Specially Abled</Label>
                </div>
                {/* "Sign Up" button */}
                <Button 
                  className="w-full" 
                  style={{ backgroundColor: palette.lightBlue }}
                >
                  Sign Up
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;