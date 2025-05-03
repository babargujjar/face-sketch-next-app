import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";


export default function Header({ onReset, onExport, onImport, onSave }) {
  const { toast } = useToast();
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result;
            onImport();
            toast({
              title: "Import successful",
              description: "Your sketch has been imported.",
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Failed to import sketch. Invalid file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Face Sketch App</h1>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleImport}
        >
          Import
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
        >
          Export
        </Button>
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </header>
  );
}
