import React from "react";
import AppCard from "./AppCard";
import { ScrollArea } from "./ui/scroll-area";

interface App {
  id: string;
  icon: string;
  name: string;
  version: string;
  description: string;
}

interface AppGridProps {
  apps?: App[];
  onInstall?: (appId: string) => void;
}

const AppGrid = ({
  apps = [
    {
      id: "1",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=app1",
      name: "Sample App 1",
      version: "1.0.0",
      description: "A powerful application that helps you be more productive.",
    },
    {
      id: "2",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=app2",
      name: "Sample App 2",
      version: "2.1.0",
      description: "An entertainment app that brings joy to your daily life.",
    },
    {
      id: "3",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=app3",
      name: "Sample App 3",
      version: "1.5.0",
      description: "A utility app that simplifies your workflow.",
    },
    {
      id: "4",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=app4",
      name: "Sample App 4",
      version: "3.0.0",
      description: "A social media app that connects you with friends.",
    },
  ],
  onInstall = (appId: string) => console.log(`Installing app ${appId}`),
}: AppGridProps) => {
  return (
    <ScrollArea className="w-full h-full bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
        {apps.map((app) => (
          <div key={app.id} className="flex justify-center">
            <AppCard
              icon={app.icon}
              name={app.name}
              version={app.version}
              description={app.description}
              onInstall={() => onInstall(app.id)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AppGrid;
