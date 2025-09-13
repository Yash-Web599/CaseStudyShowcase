import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Zap, Trash2, TrendingUp, Building, Lightbulb } from "lucide-react";

interface EnergyData {
  building: string;
  usage: number;
  capacity: number;
  status: 'efficient' | 'moderate' | 'high';
}

interface WasteData {
  type: 'wet' | 'dry';
  count: number;
  points: number;
}

export default function SustainabilityTracker() {
  const [selectedBin, setSelectedBin] = useState<'wet' | 'dry' | null>(null);
  const [wasteStats, setWasteStats] = useState<WasteData[]>([
    { type: 'wet', count: 12, points: 60 },
    { type: 'dry', count: 8, points: 40 }
  ]);

  // Mock IoT data for energy usage
  const energyData: EnergyData[] = [
    { building: 'Library', usage: 75, capacity: 100, status: 'efficient' },
    { building: 'Student Center', usage: 85, capacity: 100, status: 'moderate' },
    { building: 'Lab Building', usage: 95, capacity: 100, status: 'high' },
    { building: 'Dormitory A', usage: 60, capacity: 100, status: 'efficient' },
    { building: 'Cafeteria', usage: 90, capacity: 100, status: 'high' }
  ];

  const handleSmartBinUse = (binType: 'wet' | 'dry') => {
    setSelectedBin(binType);
    console.log(`Smart bin used: ${binType} waste`);
    
    // Update waste stats
    setWasteStats(prev => 
      prev.map(stat => 
        stat.type === binType 
          ? { ...stat, count: stat.count + 1, points: stat.points + 5 }
          : stat
      )
    );

    // Reset selection after animation
    setTimeout(() => setSelectedBin(null), 2000);
    
    // TODO: remove mock functionality - integrate with real IoT sensors
  };

  const getStatusColor = (status: EnergyData['status']) => {
    switch (status) {
      case 'efficient': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const getStatusIcon = (status: EnergyData['status']) => {
    switch (status) {
      case 'efficient': return '🟢';
      case 'moderate': return '🟡';
      case 'high': return '🔴';
    }
  };

  const totalWastePoints = wasteStats.reduce((sum, stat) => sum + stat.points, 0);
  const averageEnergyUsage = energyData.reduce((sum, data) => sum + data.usage, 0) / energyData.length;

  return (
    <div className="space-y-6" data-testid="sustainability-tracker">
      {/* Smart Waste Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-primary" />
            Smart Waste Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              variant={selectedBin === 'wet' ? 'default' : 'outline'}
              onClick={() => handleSmartBinUse('wet')}
              className="flex-col h-24 relative"
              data-testid="button-wet-bin"
            >
              <div className="flex flex-col items-center">
                <Leaf className="w-8 h-8 mb-2" />
                <span className="font-medium">Wet Waste</span>
                <span className="text-xs text-muted-foreground">Organic • Compostable</span>
              </div>
              {selectedBin === 'wet' && (
                <Badge className="absolute -top-2 -right-2 bg-green-500">
                  +5 pts!
                </Badge>
              )}
            </Button>
            
            <Button
              size="lg"
              variant={selectedBin === 'dry' ? 'default' : 'outline'}
              onClick={() => handleSmartBinUse('dry')}
              className="flex-col h-24 relative"
              data-testid="button-dry-bin"
            >
              <div className="flex flex-col items-center">
                <Trash2 className="w-8 h-8 mb-2" />
                <span className="font-medium">Dry Waste</span>
                <span className="text-xs text-muted-foreground">Plastic • Paper</span>
              </div>
              {selectedBin === 'dry' && (
                <Badge className="absolute -top-2 -right-2 bg-blue-500">
                  +5 pts!
                </Badge>
              )}
            </Button>
          </div>

          {/* Waste Statistics */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {wasteStats.map((stat) => (
              <div key={stat.type} className="text-center">
                <p className="text-2xl font-bold" data-testid={`count-${stat.type}-waste`}>
                  {stat.count}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {stat.type} Items
                </p>
                <Badge variant="outline" className="mt-1">
                  {stat.points} points
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Energy Usage Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Real-time Energy Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-3xl font-bold" data-testid="text-avg-energy">
              {averageEnergyUsage.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Average Campus Energy Usage
            </p>
          </div>

          <div className="space-y-3">
            {energyData.map((data, index) => (
              <div
                key={data.building}
                className="border rounded-md p-3 bg-muted/30"
                data-testid={`building-${index}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{data.building}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${getStatusColor(data.status)}`}>
                      {getStatusIcon(data.status)} {data.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={data.usage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>{data.usage}% usage</span>
                    <span className="text-muted-foreground">
                      Capacity: {data.capacity}kW
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campus Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Campus Sustainability Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {energyData
              .sort((a, b) => a.usage - b.usage)
              .map((data, index) => (
                <div
                  key={data.building}
                  className="flex items-center justify-between border rounded-md p-3 bg-muted/30"
                  data-testid={`leaderboard-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index < 2 ? 'default' : 'outline'} className="w-8 h-8 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{data.building}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.usage}% energy usage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {100 - data.usage} pts
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Your Sustainability Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600" data-testid="text-total-waste-points">
                {totalWastePoints}
              </p>
              <p className="text-sm text-muted-foreground">
                Points from Waste Sorting
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                45
              </p>
              <p className="text-sm text-muted-foreground">
                Energy Saved (kWh)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}