
import { UserIcon, GiftIcon, Trophy, Star, Crown } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const userProfile = () => {
    return (
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-9">
            {/* Rewards Sheet */}
            <Sheet open={isRewardsOpen} onOpenChange={setIsRewardsOpen}>
                <SheetTrigger asChild>
                    <button className="text-gray-900 hover:text-gray-600 transition-colors">
                        <GiftIcon className="w-6 h-6" aria-label="Rewards" />
                    </button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] text-white">
                    <SheetHeader>
                        <SheetTitle>Rewards & Achievements</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                        <div className="space-y-6">
                            {/* Points Overview */}
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Total Points</p>
                                        <h3 className="text-3xl font-bold">2,450</h3>
                                    </div>
                                    <Trophy className="w-12 h-12 opacity-90" />
                                </div>
                            </div>

                            {/* Recent Achievements */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
                                <div className="space-y-3">
                                    {[
                                        { title: 'Perfect Score', description: 'Complete a lesson with 100% accuracy', icon: Star },
                                        { title: 'Weekly Champion', description: 'Top performer of the week', icon: Crown },
                                        { title: '7-Day Streak', description: 'Practice for 7 days in a row', icon: Trophy }
                                    ].map((achievement, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="bg-indigo-100 p-2 rounded-full">
                                                <achievement.icon className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-white">{achievement.title}</h5>
                                                <p className="text-sm text-gray-500">{achievement.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Available Rewards */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Available Rewards</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { name: 'Premium Theme', points: 1000 },
                                        { name: 'Extra Lives', points: 500 },
                                        { name: 'Special Badge', points: 750 },
                                        { name: 'Power Boost', points: 300 }
                                    ].map((reward, index) => (
                                        <div key={index} className="p-4 border rounded-lg text-center">
                                            <h5 className="font-medium text-white">{reward.name}</h5>
                                            <p className="text-sm text-gray-500">{reward.points} points</p>
                                            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-700">
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

            {/* Profile Sheet */}
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <SheetTrigger asChild>
                    <button className="text-gray-900 hover:text-gray-600 transition-colors">
                        <UserIcon className="w-6 h-6" aria-label="Profile" />
                    </button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] text-white">
                    <SheetHeader>
                        <SheetTitle>Profile</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                        <div className="space-y-6">
                            {/* Profile Avatar */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">John Doe</h3>
                                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl text-gray-500 font-bold">12</div>
                                    <div className="text-sm text-gray-500">Lessons</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl text-gray-500 font-bold">85%</div>
                                    <div className="text-sm text-gray-500">Accuracy</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl text-gray-500 font-bold">24</div>
                                    <div className="text-sm text-gray-500">Streak</div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                                <div className="space-y-3 ">
                                    {['Completed Lesson 3', 'Earned New Badge', 'Started Lesson 4'].map((activity, index) => (
                                        <div key={index} className="flex  items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-500">{activity}</span>
                                            <span className="text-xs text-gray-500">2h ago</span>
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

export default userProfile
