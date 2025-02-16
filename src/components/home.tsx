import React, { useEffect, useState } from "react";
import Header from "./Header";
import AppGrid from "./AppGrid";
import { api, App } from "@/lib/api";

const Home = () => {
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const data = await api.getApps();
    setApps(data);
  };

  const handleSearch = async (query: string) => {
    const results = await api.searchApps(query);
    setApps(results);
  };

  const handleInstall = async (appId: string) => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={handleSearch} />
      <main className="flex-1 overflow-hidden">
        <AppGrid apps={apps} onInstall={handleInstall} />
      </main>
    </div>
  );
};

export default Home;
