import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { MoodEntry, ChatMessage } from '@shared/schema';
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Smile, 
  Meh, 
  Frown,
  Send,
  Bot,
  User,
  Loader2
} from 'lucide-react';

export default function MentalHealthSupport() {
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [moodScore, setMoodScore] = useState(5);
  const [moodNotes, setMoodNotes] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const { toast } = useToast();

  // Fetch mood history
  const { data: moodResponse, isLoading: moodLoading } = useQuery({
    queryKey: ['/moods'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch chat history
  const { data: chatResponse, isLoading: chatLoading } = useQuery({
    queryKey: ['/chats'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const moodData: MoodEntry[] = (moodResponse as any)?.data || [];
  const chatData: ChatMessage[] = (chatResponse as any)?.data || [];

  // Mood submission mutation
  const moodMutation = useMutation({
    mutationFn: async (data: { mood: string; score: number; notes?: string }) => {
      const response = await apiRequest('POST', '/moods', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mood logged successfully!",
        description: `+${data.pointsAwarded || 5} points earned`,
      });
      queryClient.invalidateQueries({ queryKey: ['/moods'] });
      setCurrentMood(null);
      setMoodNotes('');
      setMoodScore(5);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to log mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Chat message mutation
  const chatMutation = useMutation({
    mutationFn: async (data: { type: string; message: string }) => {
      const response = await apiRequest('POST', '/chats', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/chats'] });
      setChatMessage('');
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMoodSelect = (mood: 'happy' | 'neutral' | 'sad') => {
    setCurrentMood(mood);
  };

  const handleMoodSubmit = () => {
    if (!currentMood) return;
    
    moodMutation.mutate({
      mood: currentMood,
      score: moodScore,
      notes: moodNotes.trim() || undefined,
    });
  };

  const handleChatSubmit = () => {
    if (!chatMessage.trim()) return;
    
    chatMutation.mutate({
      type: 'user',
      message: chatMessage,
    });
  };

  const averageMood = moodData.length > 0 
    ? moodData.reduce((sum: number, entry: MoodEntry) => sum + entry.score, 0) / moodData.length 
    : 0;

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-4 h-4 text-green-500" />;
      case 'neutral': return <Meh className="w-4 h-4 text-yellow-500" />;
      case 'sad': return <Frown className="w-4 h-4 text-red-500" />;
      default: return <Meh className="w-4 h-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'sad': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6" data-testid="mental-health-support">
      {/* Mood Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Daily Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              How are you feeling today?
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <Button
                variant={currentMood === 'happy' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleMoodSelect('happy')}
                className="flex flex-col gap-2 p-4 h-auto"
                data-testid="mood-happy"
              >
                <Smile className="w-8 h-8" />
                Happy
              </Button>
              <Button
                variant={currentMood === 'neutral' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleMoodSelect('neutral')}
                className="flex flex-col gap-2 p-4 h-auto"
                data-testid="mood-neutral"
              >
                <Meh className="w-8 h-8" />
                Neutral
              </Button>
              <Button
                variant={currentMood === 'sad' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleMoodSelect('sad')}
                className="flex flex-col gap-2 p-4 h-auto"
                data-testid="mood-sad"
              >
                <Frown className="w-8 h-8" />
                Sad
              </Button>
            </div>
            
            {currentMood && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="text-sm font-medium">Intensity (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={moodScore}
                    onChange={(e) => setMoodScore(parseInt(e.target.value))}
                    className="mt-1"
                    data-testid="mood-score"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <Textarea
                    placeholder="What's contributing to your mood today?"
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    className="mt-1"
                    data-testid="mood-notes"
                  />
                </div>
                <Button
                  onClick={handleMoodSubmit}
                  disabled={moodMutation.isPending}
                  className="w-full"
                  data-testid="submit-mood"
                >
                  {moodMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    'Log Mood'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mood Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Mood Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {moodLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : moodData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Mood</span>
                <Badge variant="secondary">
                  {averageMood.toFixed(1)}/10
                </Badge>
              </div>
              <Progress value={averageMood * 10} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {moodData.filter((m: MoodEntry) => m.mood === 'happy').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Happy Days</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {moodData.filter((m: MoodEntry) => m.mood === 'neutral').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Neutral Days</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {moodData.filter((m: MoodEntry) => m.mood === 'sad').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Difficult Days</div>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <h4 className="font-medium">Recent Entries</h4>
                {moodData.slice(0, 5).map((entry: MoodEntry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getMoodIcon(entry.mood)}
                      <span className="text-sm">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline">{entry.score}/10</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start tracking your mood to see analytics here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wellness Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Wellness Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat History */}
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
              {chatLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : chatData.length > 0 ? (
                chatData.map((msg: ChatMessage) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {msg.type === 'bot' ? (
                          <Bot className="w-6 h-6 text-primary" />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with the wellness chatbot</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                disabled={chatMutation.isPending}
                data-testid="chat-input"
              />
              <Button 
                onClick={handleChatSubmit}
                disabled={chatMutation.isPending || !chatMessage.trim()}
                data-testid="send-chat"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}