import { useContext, useState, useEffect } from 'react'; // Importing React hooks for state and context, and useEffect for side effects.
import { Link, useNavigate } from 'react-router-dom'; // Importing Link for navigation and useNavigate for programmatic navigation.
import { AuthContext } from '../utils/AuthContext'; // Importing AuthContext to access authentication status and functions.
import { UserIcon, GiftIcon, Trophy, Star, Crown } from 'lucide-react'; // Importing icons from lucide-react.
import axios from 'axios'; // Importing axios for making HTTP requests.
import {
  Sheet,        // Component for a side sheet (drawer)
  SheetContent, // Content area of the sheet
  SheetHeader,  // Header section of the sheet
  SheetTitle,   // Title within the sheet header
  SheetTrigger, // Button/element that triggers the sheet to open
} from "@/components/ui/sheet"; // Importing UI sheet components.
import { levels } from '../levels'; // Importing the levels data.

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Accessing user data and logout function from AuthContext.
  const navigate = useNavigate(); // Hook for programmatic navigation.

  // State for controlling mobile menu visibility.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for controlling profile sheet visibility.
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // State for controlling rewards sheet visibility.
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  // State to store fetched progress data for each level.
  const [progressData, setProgressData] = useState({});
  // State to store calculated profile statistics.
  const [profileStats, setProfileStats] = useState({
    totalLessons: 0,
    averageAccuracy: 0,
    streak: 0 // Initial streak value
  });

  // useEffect hook to fetch all user progress data when the user is logged in
  // and the profile sheet is opened.
  useEffect(() => {
    const fetchAllProgress = async () => {
      // Only fetch if user is logged in and profile sheet is open.
      if (!user || !isProfileOpen) return;
      
      try {
        const progressObj = {}; // Temporary object to store fetched progress.
        
        // Loop through each level to fetch its specific progress.
        for (const level of levels) {
          try {
            // Fetch progress for the current level and user.
            const response = await fetch(`http://localhost:3000/api/progress/${user.username}/${level.file}`);
            if (response.ok) {
              const data = await response.json(); // Parse the response data.
              
              // Also fetch the total number of lessons for this level's syllabus file.
              const syllabusResponse = await fetch(`/syllabus/${level.file}`);
              if (syllabusResponse.ok) {
                const syllabusData = await syllabusResponse.json();
                data.totalLessons = syllabusData.length; // Add total lessons to progress data.
              }
              
              // Store the progress data using the level ID as the key.
              progressObj[level.id] = data;
            }
          } catch (err) {
            console.error(`❌ Failed to fetch progress for level ${level.id}:`, err);
          }
        }
        
        setProgressData(progressObj); // Update the state with all collected progress data.
        console.log("🔥 All profile progress data:", progressObj); // Log for debugging.
        
        // Calculate and update profile statistics based on the fetched progress.
        calculateProfileStats(progressObj);
      } catch (error) {
        console.error("❌ Error fetching progress data:", error);
      }
    };

    fetchAllProgress(); // Call the async function.
  }, [user, isProfileOpen]); // Dependencies: re-run when user or isProfileOpen changes.

  // Function to calculate overall profile statistics from the fetched progress data.
  const calculateProfileStats = (progressData) => {
    // If no progress data, reset stats to default and keep hardcoded streak.
    if (!progressData || Object.keys(progressData).length === 0) {
      setProfileStats({
        totalLessons: 0,
        averageAccuracy: 0,
        streak: 24 // Keeping the hardcoded streak for now
      });
      return;
    }

    let totalCompletedLessons = 0; // Accumulator for total completed lessons.
    let totalLevels = 0; // Counter for levels with progress.
    let totalAccuracy = 0; // Accumulator for total accuracy across levels.

    // Iterate through each level's progress data.
    Object.keys(progressData).forEach(levelId => {
      const progress = progressData[levelId];
      
      if (progress) {
        // Add completed lessons for the current level to the total.
        totalCompletedLessons += progress.lastLesson || 0;
        
        // Calculate completion percentage for the current level.
        const levelTotalLessons = progress.totalLessons || 1; // Prevent division by zero.
        const completionPercentage = ((progress.lastLesson || 0) / levelTotalLessons) * 100;
        
        totalAccuracy += completionPercentage; // Add to total accuracy.
        totalLevels++; // Increment level count.
      }
    });

    // Calculate the average accuracy across all levels that have progress.
    const averageAccuracy = totalLevels > 0 ? Math.round(totalAccuracy / totalLevels) : 0;

    // Update the profile stats state.
    setProfileStats({
      totalLessons: totalCompletedLessons,
      averageAccuracy,
      streak: 24 // Keeping the hardcoded streak for now
    });
  };

  // Handler for user logout.
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext.
    navigate('/'); // Redirect to the homepage.
    setIsProfileOpen(false); // Close the profile sheet.
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo Section */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">WickedMouse</span> {/* Screen reader text */}
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "WickedMouse, cursive" }} // Custom font style.
            >
              INDIC
            </h1>
          </Link>
        </div>
        
        {/* Mobile Menu Button (visible on small screens) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // Toggles mobile menu visibility.
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              // X icon when menu is open
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
        
        {/* Navigation Links (visible on large screens) */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link to="/home" className="text-sm font-semibold text-gray-900">
            Home
          </Link>
          <Link to="/games" className="text-sm font-semibold text-gray-900">
            Games
          </Link>
          <Link to="/stories" className="text-sm font-semibold text-gray-900">
            Stories
          </Link>
          <Link to="/learnings" className="text-sm font-semibold text-gray-900">
            Learnings
          </Link>
          <Link to="/ar" className="text-sm font-semibold text-gray-900">
            AR
          </Link>
        </div>
        
        {/* Authentication Links / User Actions (visible on large screens) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-6">
          {user ? ( // Conditionally render based on user authentication status.
            <>
              {/* Rewards Icon and Sheet */}
              <Sheet open={isRewardsOpen} onOpenChange={setIsRewardsOpen}>
                <SheetTrigger asChild>
                  <button className="text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">
                    <GiftIcon className="w-6 h-6" aria-label="Rewards" /> {/* Rewards icon */}
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  {/* Rewards Sheet Content */}
                  <SheetHeader>
                    <SheetTitle>Rewards & Achievements</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <div className="space-y-6">
                      {/* Points Overview Card */}
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-90">Total Points</p>
                            <h3 className="text-3xl font-bold">2,450</h3> {/* Hardcoded points */}
                          </div>
                          <Trophy className="w-12 h-12 opacity-90" /> {/* Trophy icon */}
                        </div>
                      </div>

                      {/* Recent Achievements Section */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
                        <div className="space-y-3">
                          {/* Mapping through a hardcoded list of achievements */}
                          {[
                            { title: 'Perfect Score', description: 'Complete a lesson with 100% accuracy', icon: Star },
                            { title: 'Weekly Champion', description: 'Top performer of the week', icon: Crown },
                            { title: '7-Day Streak', description: 'Practice for 7 days in a row', icon: Trophy }
                          ].map((achievement, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="bg-indigo-100 p-2 rounded-full">
                                <achievement.icon className="w-5 h-5 text-indigo-600" /> {/* Dynamic icon */}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{achievement.title}</h5>
                                <p className="text-sm text-gray-500">{achievement.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Available Rewards Section */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Available Rewards</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Mapping through a hardcoded list of rewards */}
                          {[
                            { name: 'Premium Theme', points: 1000 },
                            { name: 'Extra Lives', points: 500 },
                            { name: 'Special Badge', points: 750 },
                            { name: 'Power Boost', points: 300 }
                          ].map((reward, index) => (
                            <div key={index} className="p-4 border rounded-lg text-center">
                              <h5 className="font-medium text-gray-900">{reward.name}</h5>
                              <p className="text-sm text-gray-500">{reward.points} points</p>
                              <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer">
                                Redeem
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile Icon / Username and Sheet */}
              <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-gray-900">
                      Hello, {user.username} {/* Display authenticated user's username */}
                    </span>
                    <UserIcon className="w-6 h-6" aria-label="Profile" /> {/* User profile icon */}
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  {/* Profile Sheet Content */}
                  <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <div className="space-y-6">
                      {/* Profile Avatar and Basic Info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-gray-500" /> {/* Placeholder user icon */}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{user.fullname || user.username}</h3> {/* User's full name or username */}
                          <p className="text-sm text-gray-500">{user.email}</p> {/* User's email */}
                        </div>
                      </div>

                      {/* Profile Stats Section */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl text-gray-900 font-bold">{profileStats.totalLessons}</div> {/* Total lessons */}
                          <div className="text-sm text-gray-500">Lessons</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl text-gray-900 font-bold">{profileStats.averageAccuracy}%</div> {/* Average accuracy */}
                          <div className="text-sm text-gray-500">Accuracy</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl text-gray-900 font-bold">{profileStats.streak}</div> {/* Streak */}
                          <div className="text-sm text-gray-500">Streak</div>
                        </div>
                      </div>

                      {/* Recent Activity Section */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                        <div className="space-y-3">
                          {/* Dynamically generate recent activities based on progress data */}
                          {Object.entries(progressData).slice(0, 3).map(([levelId, progress], index) => {
                            // Convert levelId to a number for comparison
                            const numericLevelId = parseInt(levelId, 10);
                            // Find the corresponding level object from the `levels` array
                            const level = levels.find(l => l.id === numericLevelId);
                            // Get the level name, or default to levelId if not found
                            const levelName = level ? level.name : `Level ${levelId}`; // Changed default to "Level [id]"
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-500">
                                  {`Completed Lesson ${progress.lastLesson} in ${levelName}`}
                                </span>
                                <span className="text-xs text-gray-500">Recent</span>
                              </div>
                            );
                          })}
                          
                          {/* Fallback message if no progress data is available */}
                          {Object.keys(progressData).length === 0 && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-500">No recent activity</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Logout Button */}
                      <div className="pt-4 border-t">
                        <button
                          onClick={handleLogout}
                          className="w-full text-center text-red-600 hover:text-red-700 font-medium cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            // Render login/signup links if user is not authenticated
            <>
              <Link to="/login" className="text-sm font-semibold text-gray-900">
                Log in
              </Link>
              <Link to="/signup" className="text-sm font-semibold text-gray-900">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Mobile Menu (conditionally rendered when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-6 pt-2 pb-6">
            <div className="space-y-2">
              {/* Mobile navigation links, closing the menu on click */}
              <Link
                to="/home"
                className="block text-base font-semibold text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/games"
                className="block text-base font-semibold text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Games
              </Link>
              <Link
                to="/stories"
                className="block text-base font-semibold text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                to="/learnings"
                className="block text-base font-semibold text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Learnings
              </Link>
              <Link
                to="/ar"
                className="block text-base font-semibold text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                AR
              </Link>
            </div>
            <div className="mt-6">
              {user ? ( // Conditionally render based on user authentication for mobile menu
                <>
                  <button
                    onClick={() => {
                      setIsProfileOpen(true); // Open profile sheet
                      setMobileMenuOpen(false); // Close mobile menu
                    }}
                    className="block text-base font-semibold text-gray-900"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout(); // Log out
                      setMobileMenuOpen(false); // Close mobile menu
                    }}
                    className="mt-2 block text-base font-semibold text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Mobile login/signup links if not authenticated
                <>
                  <Link
                    to="/login"
                    className="block text-base font-semibold text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-base font-semibold text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; // Export the Navbar component.