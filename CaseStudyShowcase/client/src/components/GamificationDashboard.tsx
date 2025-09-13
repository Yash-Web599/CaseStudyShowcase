import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Users, TrendingUp, Award } from "lucide-react";

interface StudentRanking {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  badges: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
}

export default function GamificationDashboard() {
  const currentUser = {
    name: "Alex Chen",
    points: 1250,
    rank: 3,
    level: 7,
    nextLevelPoints: 1500
  };

  // Mock leaderboard data
  const leaderboard: StudentRanking[] = [
    { rank: 1, name: "Sarah Kim", points: 1890, avatar: "SK", badges: ["♻️", "💚", "⭐"] },
    { rank: 2, name: "Michael Zhang", points: 1670, avatar: "MZ", badges: ["🏆", "💚"] },
    { rank: 3, name: "Alex Chen", points: 1250, avatar: "AC", badges: ["♻️", "⭐"] },
    { rank: 4, name: "Emma Wilson", points: 1180, avatar: "EW", badges: ["💚"] },
    { rank: 5, name: "David Park", points: 1050, avatar: "DP", badges: ["♻️"] },
  ];

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: "mood-tracker",
      title: "Mood Master",
      description: "Log your mood for 7 consecutive days",
      points: 100,
      icon: "😊",
      unlocked: true
    },
    {
      id: "waste-warrior",
      title: "Waste Warrior",
      description: "Use smart bins 25 times",
      points: 150,
      icon: "♻️",
      unlocked: true
    },
    {
      id: "energy-saver",
      title: "Energy Saver",
      description: "Help save 100kWh of energy",
      points: 200,
      icon: "⚡",
      unlocked: false
    },
    {
      id: "wellness-champion",
      title: "Wellness Champion",
      description: "Complete 30 wellness activities",
      points: 300,
      icon: "🏆",
      unlocked: false
    }
  ];

  const progressToNextLevel = ((currentUser.points % 250) / 250) * 100;
  
  return (
    <div className="space-y-6" data-testid="gamification-dashboard">
      {/* User Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
              AC
            </div>
            <h3 className="text-xl font-bold" data-testid="text-username">
              {currentUser.name}
            </h3>
            <p className="text-muted-foreground">
              Level {currentUser.level} • Rank #{currentUser.rank}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Points</span>
              <Badge variant="default" data-testid="badge-total-points">
                {currentUser.points} pts
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {currentUser.level + 1}</span>
                <span>{Math.round(progressToNextLevel)}%</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {currentUser.nextLevelPoints - currentUser.points} points to next level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Campus Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((student) => (
              <div
                key={student.rank}
                className={`flex items-center justify-between border rounded-md p-3 ${
                  student.name === currentUser.name ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                }`}
                data-testid={`leaderboard-rank-${student.rank}`}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={student.rank <= 3 ? 'default' : 'outline'}
                    className="w-8 h-8 p-0 flex items-center justify-center"
                  >
                    {student.rank <= 3 ? (
                      student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉'
                    ) : (
                      student.rank
                    )}
                  </Badge>
                  
                  <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {student.avatar}
                  </div>
                  
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <div className="flex gap-1">
                      {student.badges.map((badge, index) => (
                        <span key={index} className="text-sm">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold" data-testid={`points-${student.rank}`}>
                    {student.points}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`border rounded-md p-4 ${
                  achievement.unlocked
                    ? 'bg-muted/30 border-primary/20'
                    : 'bg-muted/10 border-muted opacity-60'
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {achievement.title}
                      {achievement.unlocked && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Target className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {achievement.points} points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Points Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">😊</span>
                <span className="text-sm">Mood Tracking</span>
              </div>
              <Badge variant="outline">450 pts</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">♻️</span>
                <span className="text-sm">Waste Management</span>
              </div>
              <Badge variant="outline">300 pts</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚡</span>
                <span className="text-sm">Energy Saving</span>
              </div>
              <Badge variant="outline">200 pts</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏆</span>
                <span className="text-sm">Achievement Bonuses</span>
              </div>
              <Badge variant="outline">300 pts</Badge>
            </div>
            <hr />
            <div className="flex justify-between items-center font-medium">
              <span>Total Points</span>
              <Badge variant="default" data-testid="badge-total-breakdown">
                {currentUser.points} pts
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}