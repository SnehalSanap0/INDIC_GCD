import { UserIcon, GiftIcon, Trophy, Star, Crown } from 'lucide-react'; // Importing icons from lucide-react.
import {
    Sheet,          // Main Sheet component for side drawers.
    SheetContent,   // Content area within the Sheet.
    SheetHeader,    // Header section of the Sheet.
    SheetTitle,     // Title for the Sheet header.
    SheetTrigger,   // Element that triggers the Sheet to open.
} from "@/components/ui/sheet"; // Importing UI components for the Sheet (side drawer).

// userProfile functional component.
// This component likely represents the user's profile and rewards section,
// intended to be displayed in a navigation bar or similar area.
const userProfile = () => {
    return (
        // Main container div for the profile and rewards sections.
        // It's hidden on small screens and displayed as a flex container on large screens.
        // gap-x-9 adds spacing between the child elements.
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-9">
            {/* Rewards Sheet */}
            {/* The Sheet component provides a drawer-like UI.
                `open` prop controls its visibility (likely managed by a parent component's state, e.g., `isRewardsOpen`).
                `onOpenChange` prop is a callback function that fires when the sheet's open state changes.
                `className` applies Tailwind CSS classes for styling. Note: `text-white` here might be overridden
                by nested elements or might not apply correctly if other styles set text color.
            */}
            <Sheet open={isRewardsOpen} onOpenChange={setIsRewardsOpen}>
                {/* SheetTrigger defines the element that, when clicked, opens the Sheet. */}
                {/* `asChild` prop ensures the trigger is the direct child of SheetTrigger, inheriting its props. */}
                <SheetTrigger asChild>
                    {/* Button for the Rewards icon. It changes color on hover. */}
                    <button className="text-gray-900 hover:text-gray-600 transition-colors">
                        <GiftIcon className="w-6 h-6" aria-label="Rewards" /> {/* Gift icon */}
                    </button>
                </SheetTrigger>
                {/* SheetContent defines the actual content of the drawer. */}
                {/* `className` sets its width and initial text color to white. */}
                <SheetContent className="w-[400px] sm:w-[540px] text-white">
                    {/* SheetHeader for the title of the Rewards sheet. */}
                    <SheetHeader>
                        <SheetTitle>Rewards & Achievements</SheetTitle>
                    </SheetHeader>
                    {/* Main content area of the Rewards sheet. */}
                    <div className="py-6">
                        <div className="space-y-6">
                            {/* Points Overview Section */}
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Total Points</p>
                                        <h3 className="text-3xl font-bold">2,450</h3> {/* Hardcoded total points */}
                                    </div>
                                    <Trophy className="w-12 h-12 opacity-90" /> {/* Trophy icon */}
                                </div>
                            </div>

                            {/* Recent Achievements Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
                                <div className="space-y-3">
                                    {/* Mapping through a hardcoded array of achievement objects. */}
                                    {[
                                        { title: 'Perfect Score', description: 'Complete a lesson with 100% accuracy', icon: Star },
                                        { title: 'Weekly Champion', description: 'Top performer of the week', icon: Crown },
                                        { title: '7-Day Streak', description: 'Practice for 7 days in a row', icon: Trophy }
                                    ].map((achievement, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="bg-indigo-100 p-2 rounded-full">
                                                <achievement.icon className="w-5 h-5 text-indigo-600" /> {/* Dynamic icon based on achievement */}
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-white">{achievement.title}</h5> {/* Achievement title */}
                                                <p className="text-sm text-gray-500">{achievement.description}</p> {/* Achievement description */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Available Rewards Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Available Rewards</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Mapping through a hardcoded array of reward objects. */}
                                    {[
                                        { name: 'Premium Theme', points: 1000 },
                                        { name: 'Extra Lives', points: 500 },
                                        { name: 'Special Badge', points: 750 },
                                        { name: 'Power Boost', points: 300 }
                                    ].map((reward, index) => (
                                        <div key={index} className="p-4 border rounded-lg text-center">
                                            <h5 className="font-medium text-white">{reward.name}</h5> {/* Reward name */}
                                            <p className="text-sm text-gray-500">{reward.points} points</p> {/* Reward points cost */}
                                            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-700">
                                                Redeem
                                            </button> {/* Redeem button */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Profile Sheet */}
            {/* Similar structure to the Rewards Sheet, but for user profile details. */}
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <SheetTrigger asChild>
                    {/* Button for the Profile icon. */}
                    <button className="text-gray-900 hover:text-gray-600 transition-colors">
                        <UserIcon className="w-6 h-6" aria-label="Profile" /> {/* User icon */}
                    </button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] text-white">
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
                                    <h3 className="text-lg font-medium">John Doe</h3> {/* Hardcoded user name */}
                                    <p className="text-sm text-gray-500">john.doe@example.com</p> {/* Hardcoded user email */}
                                </div>
                            </div>

                            {/* Stats Section (Lessons, Accuracy, Streak) */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl text-gray-500 font-bold">12</div> {/* Hardcoded lessons */}
                                    <div className="text-sm text-gray-500">Lessons</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl text-gray-500 font-bold">85%</div> {/* Hardcoded accuracy */}
                                    <div className="text-sm text-gray-500">Accuracy</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl text-gray-500 font-bold">24</div> {/* Hardcoded streak */}
                                    <div className="text-sm text-gray-500">Streak</div>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                                <div className="space-y-3 ">
                                    {/* Mapping through a hardcoded array of activities. */}
                                    {['Completed Lesson 3', 'Earned New Badge', 'Started Lesson 4'].map((activity, index) => (
                                        <div key={index} className="flex  items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-500">{activity}</span> {/* Activity description */}
                                            <span className="text-xs text-gray-500">2h ago</span> {/* Hardcoded time ago */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default userProfile // Exporting the userProfile component.