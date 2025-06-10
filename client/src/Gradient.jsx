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

const nativeLanguages = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "marathi", label: "Marathi" },
  // Add more languages here
];

const learningLanguages = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  // Add more languages here
];

const Login = () => {
  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState("");
  const [selectedLearningLanguage, setSelectedLearningLanguage] = useState("");
  const [isSpeciallyAbled, setIsSpeciallyAbled] = useState(false);

  const palette = {
    lightestBlue: "#C5BAFF",
    lightBlue: "#C4D9FF",
  };

  return (
    <div className="bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] min-h-screen flex items-center justify-center">
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

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="flex justify-center items-center">
          <Tabs defaultValue="login" className="w-[400px] bg-white p-6 rounded-xl shadow-md">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Personal Details</TabsTrigger>
              <TabsTrigger value="signup">Language Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" placeholder="Choose a username" />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>
                <Button 
                  className="w-full" 
                  style={{ backgroundColor: palette.lightestBlue }} 
                  onClick={() => document.querySelector('[value="signup"]').click()}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="specially-abled" checked={isSpeciallyAbled} onChange={() => setIsSpeciallyAbled(!isSpeciallyAbled)} />
                  <Label htmlFor="specially-abled">Specially Abled</Label>
                </div>
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