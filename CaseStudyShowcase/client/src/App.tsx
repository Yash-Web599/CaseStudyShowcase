import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/components/Dashboard";
import MentalHealthSupport from "@/components/MentalHealthSupport";
import CampusSafety from "@/components/CampusSafety";
import SustainabilityTracker from "@/components/SustainabilityTracker";
import GamificationDashboard from "@/components/GamificationDashboard";
import ThemeToggle from "@/components/ThemeToggle";

function MainContent({ activeModule }: { activeModule: string }) {
  const { logout, userProfile } = useAuth();
  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'mental-health':
        return <MentalHealthSupport />;
      case 'campus-safety':
        return <CampusSafety />;
      case 'sustainability':
        return <SustainabilityTracker />;
      case 'gamification':
        return <GamificationDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between p-4 border-b" data-testid="app-header">
        <div className="flex items-center gap-4">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <h1 className="text-xl font-semibold">
            {activeModule === 'dashboard' && 'Dashboard'}
            {activeModule === 'mental-health' && 'Mental Health Support'}
            {activeModule === 'campus-safety' && 'Campus Safety'}
            {activeModule === 'sustainability' && 'Sustainability Tracker'}
            {activeModule === 'gamification' && 'Gamification & Leaderboard'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {userProfile?.displayName || 'User'}
          </span>
          <ThemeToggle />
          <button
            onClick={logout}
            className="text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-logout"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const { userProfile } = useAuth();

  // Custom sidebar width for campus application
  const style = {
    "--sidebar-width": "20rem",       // 320px for better module navigation
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    console.log('Active module changed to:', module);
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full" data-testid="app-container">
        <AppSidebar 
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          userPoints={userProfile?.points || 0}
        />
        <MainContent activeModule={activeModule} />
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ProtectedRoute>
            <AppContent />
          </ProtectedRoute>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
