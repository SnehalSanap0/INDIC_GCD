import { useNavigate } from "react-router-dom";
import { levels } from "./levels";
import LevelCard from "./LevelCard";
import { Link } from "react-router-dom";
import { UserIcon, GiftIcon, Trophy, Star, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({});

  // ✅ Fetch the current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true, // ✅ Send cookies
        });

        setCurrentUser(response.data.user);
        console.log("🔥 Logged-in User:", response.data.user);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      } finally {
        setLoading(false); // ✅ Stop loading after fetch
      }
    };

    fetchCurrentUser();
  }, []);

  // ✅ Fetch progress data for all levels
  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!currentUser) return;
      
      try {
        const progressObj = {};
        
        // Fetch progress for each level
        for (const level of levels) {
          try {
            const response = await fetch(`http://localhost:3000/api/progress/${currentUser.username}/${level.file}`);
            if (response.ok) {
              const data = await response.json();
              // Save the progress data with the level id as the key
              progressObj[level.id] = data;
            }
          } catch (err) {
            console.error(`❌ Failed to fetch progress for level ${level.id}:`, err);
          }
        }
        
        setProgressData(progressObj);
        console.log("🔥 All progress data:", progressObj);
      } catch (error) {
        console.error("❌ Error fetching progress data:", error);
      }
    };

    if (currentUser) {
      fetchAllProgress();
    }
  }, [currentUser]);

  const handleLevelSelect = (level) => {
    if (!loading && !currentUser) {
      console.error("❌ No user found, redirecting to login...");
      navigate("/login", { 
        state: { 
          redirectTo: `/lesson/${level.id}`, 
          levelFile: level.file 
        } 
      });
      return;
    }

    console.log("🚀 Navigating with User:", currentUser.username);
    navigate(`/lesson/${level.id}`, { 
      state: { 
        levelFile: level.file, 
        userId: currentUser.username
      } 
    });
  };

  // ✅ Function to calculate total lessons for a level
  const fetchTotalLessons = async (levelFile) => {
    try {
      const response = await fetch(`/syllabus/${levelFile}`);
      if (response.ok) {
        const data = await response.json();
        return data.length;
      }
      return 0;
    } catch (error) {
      console.error(`❌ Error fetching lesson data for ${levelFile}:`, error);
      return 0;
    }
  };

  return (
    <div className="bg-white min-h-screen">
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
          />
          <div
            className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[-30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(25.9% 44.1%, 0% 61.6%, 2.5% 26.9%, 14.5% 0.1%, 19.3% 2%, 27.5% 32.5%, 39.8% 62.4%, 47.6% 68.1%, 52.5% 58.3%, 54.8% 34.5%, 72.5% 76.7%, 99.9% 64.9%, 82.1% 100%, 72.4% 76.8%, 23.9% 97.7%, 25.9% 44.1%)",
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="flex min-h-screen items-center justify-center pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 max-w-6xl mx-auto justify-items-center">
            {levels.map((level, index) => (
              <div
                key={level.id}
                className={`w-80 h-80 bg-white rounded-lg shadow-md flex items-center justify-center ${
                  index === levels.length - 1 && levels.length % 3 === 1
                    ? "lg:col-start-2"
                    : index === levels.length - 1 && levels.length % 3 === 2
                    ? "lg:col-start-2 lg:col-span-2"
                    : ""
                }`}
              >
                <LevelCard 
                  level={level} 
                  onSelect={handleLevelSelect} 
                  progress={progressData[level.id]} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;