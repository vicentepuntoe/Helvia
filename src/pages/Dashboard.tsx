import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ChatSection from '../components/dashboard/ChatSection';
import ConversationsList from '../components/dashboard/ConversationsList';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import TeamSection from '../components/dashboard/TeamSection';
import IntegrationsSection from '../components/dashboard/IntegrationsSection';
import AdvancedSettings from '../components/dashboard/AdvancedSettings';

type DashboardView = 'chat' | 'conversations' | 'analytics' | 'team' | 'integrations' | 'settings';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('chat');

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return <ChatSection />;
      case 'conversations':
        return <ConversationsList />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'team':
        return <TeamSection />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'settings':
        return <AdvancedSettings onBackToChat={() => setActiveView('chat')} />;
      default:
        return <ChatSection />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
