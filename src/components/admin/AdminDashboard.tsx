import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Package } from "lucide-react";
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add New App
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddApp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">APK File</label>
                <Input type="file" name="apk" accept=".apk" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">App Icon</label>
                <Input type="file" name="icon" accept="image/*" required />
              </div>
              <Input name="name" placeholder="App Name" required />
              <Input name="version" placeholder="Version" required />
              <Textarea name="description" placeholder="Description" required />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload App"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Total Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{apps.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Total Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {apps.reduce((acc, app) => acc + app.downloads, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {apps.map((app) => (
              <div
                key={app.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{app.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    v{app.version}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {app.downloads} downloads
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {app.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the application and all its data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteApp(app.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
