import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import SketchApp from "@/pages/SketchApp";
import NotFound from "@/pages/not-found";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "sonner";


function Router() {
  return (
    <Switch>
      <Route path="/" component={SketchApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function page() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <Router />
        <Toaster position="top-right" richColors />
      </DndProvider>
    </QueryClientProvider>
  );
}

export default page;
