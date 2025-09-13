import { Heart, Shield, Leaf, Trophy, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import mentalHealthIcon from "@assets/generated_images/Mental_health_wellbeing_icon_508f7e2b.png";
import campusSafetyIcon from "@assets/generated_images/Campus_safety_SOS_icon_927f7227.png";
import sustainabilityIcon from "@assets/generated_images/Sustainability_energy_recycling_icon_eedc244d.png";
import gamificationIcon from "@assets/generated_images/Gamification_leaderboard_trophy_icon_f8887163.png";

interface AppSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  userPoints: number;
}

export default function AppSidebar({ activeModule, onModuleChange, userPoints }: AppSidebarProps) {
  const modules = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
      description: "Overview"
    },
    {
      id: "mental-health",
      title: "Mental Health",
      icon: Heart,
      description: "Mood & Wellness",
      customIcon: mentalHealthIcon
    },
    {
      id: "campus-safety",
      title: "Campus Safety",
      icon: Shield,
      description: "Emergency & SOS",
      customIcon: campusSafetyIcon
    },
    {
      id: "sustainability",
      title: "Sustainability",
      icon: Leaf,
      description: "Energy & Waste",
      customIcon: sustainabilityIcon
    },
    {
      id: "gamification",
      title: "Gamification",
      icon: Trophy,
      description: "Leaderboard & Points",
      customIcon: gamificationIcon
    },
  ];

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
            SC
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Smart Campus</h2>
            <p className="text-xs text-muted-foreground">Wellbeing Hub</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium">Your Points</span>
          <Badge variant="default" data-testid="badge-sidebar-points">
            {userPoints}
          </Badge>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Campus Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => (
                <SidebarMenuItem key={module.id}>
                  <SidebarMenuButton
                    onClick={() => onModuleChange(module.id)}
                    data-active={activeModule === module.id}
                    className="cursor-pointer"
                    data-testid={`sidebar-${module.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {module.customIcon ? (
                        <img
                          src={module.customIcon}
                          alt={module.title}
                          className="w-5 h-5"
                        />
                      ) : (
                        <module.icon className="w-5 h-5" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium">{module.title}</span>
                        <p className="text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}