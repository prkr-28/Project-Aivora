import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageLoader } from "@/components/PageLoader";
import { AuthInitializer } from "@/components/AuthInitializer";
import { ChatAssistant } from "@/components/ChatAssistant";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateGoalPage from "@/pages/CreateGoalPage";
import GoalDetailPage from "@/pages/GoalDetailPage";
import InsightsPage from "@/pages/InsightsPage";

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <BrowserRouter>
        <AuthInitializer />
        <PageLoader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-goal" element={<CreateGoalPage />} />
          <Route path="/goal/:id" element={<GoalDetailPage />} />
          <Route path="/insights/:id" element={<InsightsPage />} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </ThemeProvider>
  );
}
