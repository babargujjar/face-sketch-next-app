// import { Button } from "../components/ui/button";
// import { toast } from "sonner";


// export default function Header({ onReset, onExport, onImport, onSave }) {
  
//   const handleImport = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.json';
//     input.onchange = (event) => {
//       const file = event.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           try {
//             const content = e.target?.result;
//             onImport();
//              toast.success("Import successful", {
//                description: "Your sketch has been imported.",
//              });
//           } catch (error) {
//             toast.error("Import failed", {
//               description: "Failed to import sketch. Invalid file format.",
//             });
//           }
//         };
//         reader.readAsText(file);
//       }
//     };
//     input.click();
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center">
//       <div className="flex items-center">
//         <h1 className="text-xl font-semibold text-gray-800">Face Sketch App</h1>
//       </div>
//       <div className="flex space-x-2">
//         <Button 
//           variant="outline" 
//           size="sm"
//           onClick={handleImport}
//         >
//           Import
//         </Button>
//         <Button 
//           variant="outline" 
//           size="sm"
//           onClick={onExport}
//         >
//           Export
//         </Button>
//         <Button size="sm" onClick={onSave}>
//           Save
//         </Button>
//       </div>
//     </header>
//   );
// }
// components/Header.tsx
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Upload, Download, Save, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Header({ onReset, onExport, onImport, onSave }) {
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
    <header className="bg-white shadow-md border-b px-6 py-3 rounded-md flex justify-between items-center">
      <Link href="/">
      <h1 className="text-2xl font-bold text-indigo-600">Face Sketch App</h1>
      </Link>

      <div className="flex gap-2">
        <Link href="/similerity">
        <Button className="cursor-pointer" variant="outline" size="sm">
          Check Similerity
        </Button>
        </Link>
        <Button className="cursor-pointer" variant="outline" size="sm" onClick={handleImport}>
          <Upload className="w-4 h-4 mr-1" />
          Import
        </Button>
        <Button className="cursor-pointer" variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button className="cursor-pointer hover:outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>
    </header>
  );
}
