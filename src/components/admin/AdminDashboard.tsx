import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Package, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface App {
  id: string;
  name: string;
  version: string;
  downloads: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await api.signOut();
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };
  const [apps, setApps] = useState<App[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await api.getApps();
      setApps(data);
    } catch (error) {
      console.error("Error loading apps:", error);
    }
  };

  const handleAddApp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const appData = {
        name: formData.get("name") as string,
        version: formData.get("version") as string,
        description: formData.get("description") as string,
        icon: formData.get("icon") as File,
        apk: formData.get("apk") as File,
      };

      await api.addApp(appData);
      await loadApps();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding app:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApp = async (id: string) => {
    try {
      await api.deleteApp(id);
      await loadApps();
    } catch (error) {
      console.error("Error deleting app:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#FAFAF9] p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          className="flex justify-between items-center gap-4 bg-white p-6 rounded-xl border border-[#E5DDD3] shadow-sm"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-[#1B365D]">
              Admin Dashboard
            </h1>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-[#E5DDD3] hover:border-[#1B365D] hover:bg-[#F5F0EA] text-[#1B365D] transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B365D] hover:bg-[#264773] transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" /> Add New App
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border border-[#E5DDD3]">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#1B365D]">
                  Add New Application
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddApp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#4A4645]">
                    APK File
                  </label>
                  <Input
                    type="file"
                    name="apk"
                    accept=".apk"
                    required
                    className="border-[#E5DDD3] focus:border-[#1B365D]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#4A4645]">
                    App Icon
                  </label>
                  <Input
                    type="file"
                    name="icon"
                    accept="image/*"
                    required
                    className="border-[#E5DDD3] focus:border-[#1B365D]"
                  />
                </div>
                <Input
                  name="name"
                  placeholder="App Name"
                  required
                  className="border-[#E5DDD3] focus:border-[#1B365D]"
                />
                <Input
                  name="version"
                  placeholder="Version"
                  required
                  className="border-[#E5DDD3] focus:border-[#1B365D]"
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  required
                  className="border-[#E5DDD3] focus:border-[#1B365D]"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1B365D] hover:bg-[#264773] transition-colors duration-200"
                >
                  {isLoading ? "Uploading..." : "Upload App"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <motion.div variants={item}>
            <Card className="border-[#E5DDD3] bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-[#1B365D]">
                  <Package className="w-4 h-4" /> Total Apps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1B365D]">
                  {apps.length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-[#E5DDD3] bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-[#1B365D]">
                  <Download className="w-4 h-4" /> Total Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1B365D]">
                  {apps.reduce((acc, app) => acc + app.downloads, 0)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-[#E5DDD3] bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="font-serif text-[#1B365D]">
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[#E5DDD3]">
                {apps.map((app) => (
                  <motion.div
                    key={app.id}
                    className="py-4 flex justify-between items-center"
                    whileHover={{ backgroundColor: "#F5F0EA" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <h3 className="font-medium text-[#1B365D]">{app.name}</h3>
                      <p className="text-sm text-[#8B8685]">v{app.version}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#8B8685]">
                        {app.downloads} downloads
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border border-[#E5DDD3]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-serif text-[#1B365D]">
                              Delete {app.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[#4A4645]">
                              This action cannot be undone. This will
                              permanently delete the application and all its
                              data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#E5DDD3] hover:border-[#1B365D] hover:bg-[#F5F0EA] text-[#1B365D]">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteApp(app.id)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
