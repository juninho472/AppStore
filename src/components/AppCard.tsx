import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface AppCardProps {
  icon?: string;
  name?: string;
  version?: string;
  description?: string;
  apkUrl?: string;
  onInstall?: (apkUrl: string) => void;
}

const AppCard = ({
  icon = "https://api.dicebear.com/7.x/avataaars/svg?seed=app",
  name = "Sample App",
  version = "1.0.0",
  description = "A sample application description that showcases what this app can do for its users. Features and benefits are highlighted here.",
  apkUrl = "",
  onInstall = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
}: AppCardProps) => {
  return (
    <Card className="w-[320px] h-[380px] bg-white flex flex-col">
      <CardHeader className="space-y-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden">
          <img
            src={icon}
            alt={`${name} icon`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">Version {version}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onInstall(apkUrl)}>
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppCard;
