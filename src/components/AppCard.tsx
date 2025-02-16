import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="w-[320px] h-[380px] bg-white flex flex-col border border-[#E5DDD3] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(141,141,141,0.12)] hover:shadow-[0_4px_25px_rgba(141,141,141,0.18)] transition-shadow duration-300">
        <CardHeader className="space-y-4 text-center pt-8 pb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-[#F5F0EA] p-2 border border-[#E5DDD3]"
          >
            <img
              src={icon}
              alt={`${name} icon`}
              className="w-full h-full object-cover rounded-xl"
            />
          </motion.div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-semibold text-[#1B365D]">
              {name}
            </h3>
            <p className="text-sm font-medium text-[#8B8685]">
              Version {version}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow px-6">
          <p className="text-sm leading-relaxed text-[#4A4645] line-clamp-4 font-sans">
            {description}
          </p>
        </CardContent>
        <CardFooter className="pb-6 px-6">
          <Button
            className="w-full bg-[#1B365D] hover:bg-[#264773] text-white rounded-lg py-6 font-medium transition-colors duration-300 border border-[#1B365D] hover:border-[#264773] shadow-sm"
            onClick={() => onInstall(apkUrl)}
          >
            <Download className="w-4 h-4 mr-2" />
            Install Application
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AppCard;
