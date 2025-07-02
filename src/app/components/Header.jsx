import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Upload, Download, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ onReset, onExport, onImport, onSave }) {
  const router = useRouter();

  const handleLogout = () => {
    toast("Are you sure you want to logout?", {
      description: "This will remove your session.",
      action: {
        label: "Yes, Logout",
        onClick: () => {
          document.cookie = "authToken=; path=/; max-age=0";
          router.push("/auth");
        },
      },
    });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          onImport();
          toast.success("Import successful", {
            description: "Your sketch has been imported.",
          });
        } catch {
          toast.error("Import failed", {
            description: "Invalid file format.",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 shadow-lg px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">
          🎨 Forensic Face Sketch
        </h1>
      </Link>

      <div className="flex gap-2 flex-wrap">
        <Button
          className="hover:brightness-110 cursor-pointer transition"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Link href="/similerity">
          <Button
            className="hover:brightness-110 cursor-pointer transition"
            variant="ghost"
            size="sm"
          >
            Check Similarity
          </Button>
        </Link>
        <Button
          className="hover:brightness-110 cursor-pointer transition"
          variant="ghost"
          size="sm"
          onClick={handleImport}
        >
          <Upload className="w-4 h-4 mr-1" />
          Import
        </Button>
        <Button
          className="hover:brightness-110 cursor-pointer transition"
          variant="ghost"
          size="sm"
          onClick={onExport}
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button
          className="hover:brightness-110 cursor-pointer transition"
          size="sm"
          variant="ghost"
          onClick={onSave}
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>
    </header>
  );
}
