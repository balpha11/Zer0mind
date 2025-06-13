// src/AppRoutes.jsx
import ProtectedRoute from "@/components/ProtectedRoute";
import { Navigate, Route, Routes } from "react-router-dom";

/* ─── Layouts ─────────────────────────────────────────────── */
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ChatLayout from "@/layouts/ChatLayout";
import MainAppLayout from "@/layouts/MainAppLayout";
import ContentLayout from "@/layouts/ContentLayout";

/* ─── Public pages ────────────────────────────────────────── */
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FeaturesPage from "@/pages/FeaturesPage";
import LandingPage from "@/pages/LandingPage";
import PricingPage from "@/pages/PricingPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import SettingsPage from "@/pages/SettingsPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";

/* ─── Content Management pages ────────────────────────────── */
import KnowledgeBasePage from "@/pages/content/KnowledgeBasePage";
import AgentDocsPage from "@/pages/content/AgentDocsPage";
import TrainingPage from "@/pages/content/TrainingPage";
import ForumPage from "@/pages/content/ForumPage";
import FAQPage from "@/pages/content/FAQPage";

/* ─── Auth pages ──────────────────────────────────────────── */
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

/* ─── Chat ────────────────────────────────────────────────── */
import ChatPage from "@/pages/ChatPage";

/* ─── Agent explorer (public) ─────────────────────────────── */
import AgentComparison from "@/pages/agents/AgentComparison";
import AgentDetails from "@/pages/agents/AgentDetails";
import AgentDirectory from "@/pages/agents/AgentDirectory";

/* ─── Admin panel pages ───────────────────────────────────── */
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AgentAssignmentPage from "@/pages/admin/AgentAssignmentPage";
import AgentOrchestrationPage from "@/pages/admin/AgentOrchestrationPage";
import AgentRegistryPage from "@/pages/admin/AgentRegistryPage";
import ApiKeyManagementPage from "@/pages/admin/ApiKeyManagementPage";
import FlowBuilder from "@/pages/admin/FlowBuilder";
import FlowManagementPage from "@/pages/admin/FlowManagementPage";
import GuardrailsPage from "@/pages/admin/GuardrailsPage";
import PromptManagementPage from "@/pages/admin/PromptManagementPage";
import RunLogsPage from "@/pages/admin/RunLogsPage";
import ToolManagerPage from "@/pages/admin/tools/ToolManagerPage";
import UserFeedbackPage from "@/pages/admin/UserFeedbackPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";

/* ─── Error page (public-only) ────────────────────────────── */
import NotFoundPage from "@/pages/error/404";

const AppRoutes = () => (
  <Routes>
    {/* ─────────────────────────────  Public site  ───────────────────────────── */}
    <Route element={<MainAppLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="about"    element={<AboutPage />} />
      <Route path="pricing"  element={<PricingPage />} />
      <Route path="features" element={<FeaturesPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="contact"  element={<ContactPage />} />
      <Route path="privacy"  element={<PrivacyPolicyPage />} />
      <Route path="terms"    element={<TermsOfServicePage />} />

      {/* Agent explorer */}
      <Route path="agents">
        <Route index      element={<AgentDirectory />} />
        <Route path="compare"  element={<AgentComparison />} />
        <Route path=":agentId" element={<AgentDetails />} />
      </Route>

      {/* public-site 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    {/* ─────────────────────────────  Content Management  ────────────────────── */}
    <Route path="content" element={<ContentLayout />}>
      <Route path="knowledge-base" element={<KnowledgeBasePage />} />
      <Route path="agent-docs" element={<AgentDocsPage />} />
      <Route path="training" element={<TrainingPage />} />
      <Route path="forum" element={<ForumPage />} />
      <Route path="faq" element={<FAQPage />} />
    </Route>

    {/* ─────────────────────────────  Chat (separate layout)  ────────────────── */}
    <Route element={<ChatLayout />}>
      <Route path="chat"          element={<ChatPage />} />
      <Route path="chat/:chatId"  element={<ChatPage />} />
    </Route>

    {/* ─────────────────────────────  User auth  ─────────────────────────────── */}
    <Route element={<AuthLayout />}>
      <Route path="login"  element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
    </Route>

    {/* ─────────────────────────────  Admin auth (stand-alone)  ──────────────── */}
    <Route path="/admin/login" element={<AdminLoginPage />} />

    {/* ─────────────────────────────  Protected admin panel  ─────────────────── */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      {/* dashboard */}
      <Route index element={<AdminDashboardPage />} />

      {/* top-level */}
      <Route path="profile"   element={<AdminProfilePage />} />
      <Route path="settings"  element={<AdminSettingsPage />} />
      <Route path="users"     element={<UserManagementPage />} />

      {/* agents */}
      <Route path="agents">
        <Route index          element={<AgentRegistryPage />} />
        <Route path="assignment"     element={<AgentAssignmentPage />} />
        <Route path="orchestration"  element={<AgentOrchestrationPage />} />
      </Route>

      {/* flows */}
      <Route path="flows">
        <Route index    element={<FlowManagementPage />} />
        <Route path="builder" element={<FlowBuilder />} />
      </Route>

      {/* other modules */}
      <Route path="prompts"    element={<PromptManagementPage />} />
      <Route path="tools"      element={<ToolManagerPage />} />
      <Route path="api-keys"   element={<ApiKeyManagementPage />} />
      <Route path="guardrails" element={<GuardrailsPage />} />
      <Route path="logs"       element={<RunLogsPage />} />
      <Route path="feedback"   element={<UserFeedbackPage />} />

      {/* admin fallback → dashboard */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
