import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  Shield, 
  Leaf, 
  Trophy, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

interface UserStats {
  totalPoints: number;
  level: number;
  rank: number;
  moodScore: number;
  wasteItems: number;
  energySaved: number;
  safetyAlerts: number;
}

interface RecentActivity {
  type: string;
  message: string;
  time: string;
  points: number;
}

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch user profile and stats
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/auth/me'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch user's recent mood entries for activity feed
  const { data: moodData, isLoading: moodLoading } = useQuery({
    queryKey: ['/moods'],
    staleTime: 1000 * 60 * 5,
  });

  // Fetch user's recent chat messages for activity feed  
  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ['/chats'],
    staleTime: 1000 * 60 * 5,
  });

  // Fetch leaderboard for user rank
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/gamification/leaderboard'],
    staleTime: 1000 * 60 * 10,
  });

  const isLoading = profileLoading || moodLoading || chatLoading || leaderboardLoading;

  // Process user data
  const userInfo = (userProfile as any)?.data || {};
  const moods = (moodData as any)?.data || [];
  const chats = (chatData as any)?.data || [];
  const leaderboard = (leaderboardData as any)?.data || [];

  // Calculate user statistics
  const stats: UserStats = {
    totalPoints: userInfo.points || 0,
    level: userInfo.level || 1,
    rank: leaderboard.findIndex((u: any) => u.uid === userInfo.uid) + 1 || 1,
    moodScore: moods.length > 0 ? 
      moods.slice(0, 7).reduce((acc: number, mood: any) => acc + mood.score, 0) / Math.min(moods.length, 7) : 0,
    wasteItems: userInfo.wasteItems || 0,
    energySaved: userInfo.energySaved || 0,
    safetyAlerts: 0
  };

  // Generate recent activities from user data
  const generateRecentActivities = (): RecentActivity[] => {
    const activities: RecentActivity[] = [];
    
    // Add recent moods
    moods.slice(0, 3).forEach((mood: any) => {
      activities.push({
        type: 'mood',
        message: `Logged daily mood - ${mood.mood.charAt(0).toUpperCase() + mood.mood.slice(1)}`,
        time: new Date(mood.timestamp).toLocaleString(),
        points: mood.pointsAwarded || 5
      });
    });

    // Add recent chats (user messages only)
    chats.filter((chat: any) => chat.type === 'user').slice(0, 2).forEach((chat: any) => {
      activities.push({
        type: 'chat',
        message: 'Engaged with wellness chatbot',
        time: new Date(chat.timestamp).toLocaleString(),
        points: 2
      });
    });

    // Sort by timestamp and take most recent
    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);
  };

  const recentActivities = generateRecentActivities();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mood': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'chat': return <Heart className="w-4 h-4 text-purple-500" />;
      case 'waste': return <Leaf className="w-4 h-4 text-green-500" />;
      case 'energy': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  // Calculate level progress
  const pointsInCurrentLevel = stats.totalPoints % 250;
  const progressToNextLevel = (pointsInCurrentLevel / 250) * 100;
  const pointsToNextLevel = 250 - pointsInCurrentLevel;

  return (
    <div className="space-y-6" data-testid="dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold" data-testid="text-welcome">
                  Welcome back, {user?.displayName || 'Student'}! 👋
                </h1>
                <p className="text-muted-foreground">
                  You've earned <strong>{stats.totalPoints} points</strong> and you're ranked <strong>#{stats.rank}</strong> on campus
                </p>
              </>
            )}
          </div>
          <div className="text-right">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 w-24" />
              </div>
            ) : (
              <>
                <Badge variant="default" className="mb-2">
                  Level {stats.level}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {pointsToNextLevel} points to Level {stats.level + 1}
                </div>
                <Progress value={progressToNextLevel} className="w-24 h-2 mt-1" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="stat-card-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campus Rank</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 my-1" />
                ) : (
                  <p className="text-2xl font-bold">#{stats.rank}</p>
                )}
                <p className="text-xs text-green-600">Based on points</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mood Score</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 my-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats.moodScore.toFixed(1)}/10</p>
                )}
                <p className="text-xs text-green-600">7-day average</p>
              </div>
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mood Entries</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 my-1" />
                ) : (
                  <p className="text-2xl font-bold">{moods.length}</p>
                )}
                <p className="text-xs text-green-600">Total logged</p>
              </div>
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chat Messages</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 my-1" />
                ) : (
                  <p className="text-2xl font-bold">{chats.filter((c: any) => c.type === 'user').length}</p>
                )}
                <p className="text-xs text-green-600">With wellness bot</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                    data-testid={`activity-${index}`}
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +{activity.points} pts
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No recent activities</p>
                  <p className="text-xs">Start logging your mood or chat with the wellness bot!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campus Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Campus Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">All systems operational</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Safety alerts</span>
                </div>
                <Badge variant="outline">
                  {stats.safetyAlerts} active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Active participants</span>
                </div>
                <Badge variant="outline">
                  2,847 students
                </Badge>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Today's Campus Goals</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energy reduction target</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Waste sorting participation</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-md bg-muted/30 hover-elevate cursor-pointer">
              <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Log Mood</p>
              <p className="text-xs text-muted-foreground">Quick entry</p>
            </div>
            
            <div className="text-center p-4 border rounded-md bg-muted/30 hover-elevate cursor-pointer">
              <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Sort Waste</p>
              <p className="text-xs text-muted-foreground">Use smart bins</p>
            </div>
            
            <div className="text-center p-4 border rounded-md bg-muted/30 hover-elevate cursor-pointer">
              <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Safety Check</p>
              <p className="text-xs text-muted-foreground">Campus status</p>
            </div>
            
            <div className="text-center p-4 border rounded-md bg-muted/30 hover-elevate cursor-pointer">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Leaderboard</p>
              <p className="text-xs text-muted-foreground">Your ranking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}