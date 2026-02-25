import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-context";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import BrandPortalLayout from "@/layouts/BrandPortalLayout";
import Dashboard from "@/pages/Dashboard";
import CampaignsList from "@/pages/campaigns/CampaignsList";
import CreateCampaign from "@/pages/campaigns/CreateCampaign";
import CampaignDetail from "@/pages/campaigns/CampaignDetail";
import CampaignFindTalent from "@/pages/campaigns/CampaignFindTalent";
import Creators from "@/pages/Creators";
import Messages from "@/pages/Messages";
import BrandSettings from "@/pages/BrandSettings";
import UpgradePlan from "@/pages/UpgradePlan";

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<BrandPortalLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignsList />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/campaigns/:id/find-talent" element={<CampaignFindTalent />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<BrandSettings />} />
            <Route path="/upgrade" element={<UpgradePlan />} />
          </Route>
        </Routes>
        <ThemeSwitcher />
      </HashRouter>
    </ThemeProvider>
  );
}
