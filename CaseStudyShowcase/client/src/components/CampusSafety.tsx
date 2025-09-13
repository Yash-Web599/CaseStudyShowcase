import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Phone, Clock, AlertTriangle } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface SafetyAlert {
  id: string;
  timestamp: string;
  location: LocationData;
  status: 'active' | 'resolved';
}

export default function CampusSafety() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      timestamp: '2024-01-05T10:30:00',
      location: { latitude: 40.7128, longitude: -74.0060, accuracy: 10 },
      status: 'resolved'
    }
  ]);

  // Get user location
  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(`Location error: ${error.message}`);
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSOSPress = () => {
    setSosActive(true);
    console.log('SOS ACTIVATED - Emergency services contacted');
    console.log('Current location:', location);

    // Create new alert
    if (location) {
      const newAlert: SafetyAlert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        location,
        status: 'active'
      };
      setRecentAlerts(prev => [newAlert, ...prev]);
    }

    // Auto-reset after 5 seconds for demo
    setTimeout(() => {
      setSosActive(false);
    }, 5000);

    // TODO: remove mock functionality - integrate with Firebase Functions for real emergency services
  };

  const formatLocation = (loc: LocationData) => {
    return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6" data-testid="campus-safety">
      {/* Emergency SOS Button */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="w-5 h-5" />
            Emergency SOS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sosActive && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Emergency alert sent! Campus security and emergency services have been notified.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-center space-y-4">
            <Button
              size="lg"
              variant="destructive"
              onClick={handleSOSPress}
              disabled={sosActive}
              className="h-24 w-24 rounded-full text-lg font-bold"
              data-testid="button-sos"
            >
              {sosActive ? (
                <div className="flex flex-col items-center">
                  <AlertTriangle className="w-8 h-8" />
                  <span className="text-xs">SENT</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Shield className="w-8 h-8" />
                  <span className="text-xs">SOS</span>
                </div>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Press and hold in case of emergency
            </p>
          </div>

          {/* Location Status */}
          <div className="border rounded-md p-3 bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Location Status:</span>
            </div>
            {location ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm" data-testid="text-location">
                  📍 {formatLocation(location)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Accuracy: ±{location.accuracy.toFixed(0)}m
                </p>
                <Badge variant="outline" className="text-xs">
                  Location available ✓
                </Badge>
              </div>
            ) : locationError ? (
              <div className="mt-2">
                <p className="text-sm text-destructive" data-testid="text-location-error">
                  {locationError}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="mt-2"
                  data-testid="button-retry-location"
                >
                  Retry Location
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Getting location...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              data-testid="button-campus-security"
            >
              <div className="text-left">
                <p className="font-medium">Campus Security</p>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              data-testid="button-counseling"
            >
              <div className="text-left">
                <p className="font-medium">Counseling Services</p>
                <p className="text-sm text-muted-foreground">Mental health support</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              data-testid="button-medical"
            >
              <div className="text-left">
                <p className="font-medium">Medical Emergency</p>
                <p className="text-sm text-muted-foreground">Health center</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border rounded-md p-3 bg-muted/30"
                data-testid={`alert-${alert.id}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'}>
                    {alert.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                <p className="text-sm">
                  📍 {formatLocation(alert.location)}
                </p>
                {alert.status === 'resolved' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Emergency resolved by campus security
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}