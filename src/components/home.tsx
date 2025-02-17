import React, { useEffect, useState } from "react";
import Header from "./Header";
import AppGrid from "./AppGrid";
import { api, App } from "@/lib/api";
import { motion } from "framer-motion";

const Home = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setIsLoading(true);
      const data = await api.getApps();
      setApps(data);
    } catch (error) {
      console.error("Error loading apps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const results = await api.searchApps(query);
      setApps(results);
    } catch (error) {
      console.error("Error searching apps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstall = async (appId: string) => {
    try {
      await api.incrementDownload(appId);
      const app = apps.find((a) => a.id === appId);
      if (app?.apkUrl) {
        const link = document.createElement("a");
        link.href = app.apkUrl;
        link.download = `${app.name}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error installing app:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-[#FAFAF9]"
    >
      <Header onSearch={handleSearch} />
      <main className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[#1B365D] font-serif text-xl">Loading...</div>
          </div>
        ) : (
          <AppGrid apps={apps} onInstall={handleInstall} />
        )}
      </main>
    </motion.div>
  );
};

export default Home;
