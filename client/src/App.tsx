import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";
import MiniPlayer from "@/components/MiniPlayer";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Search from "@/pages/Search";
import About from "@/pages/About";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import { useMusicContext } from "@/context/MusicContext";

function Router() {
  return (
    <div className="flex h-screen bg-background-dark text-text-primary">
      <Sidebar />
      <div className="flex-1 ml-[70px] pb-20 overflow-y-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/library" component={Library} />
          <Route path="/search" component={Search} />
          <Route path="/about" component={About} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <MiniPlayer />
    </div>
  );
}

function App() {
  const { isLoaded } = useMusicContext();

  return (
    <QueryClientProvider client={queryClient}>
      {isLoaded ? <Router /> : <div className="h-screen w-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
