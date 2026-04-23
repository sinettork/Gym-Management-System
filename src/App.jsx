import { useState } from 'react';
import { Calendar, LogOut } from 'lucide-react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MembershipCard from './components/MembershipCard';
import RevenueCard from './components/RevenueCard';
import CheckinsChart from './components/CheckinsChart';
import StatsCards from './components/StatsCards';
import BusinessTargets from './components/BusinessTargets';
import ActionCards from './components/ActionCards';
import CrudWorkspace from './components/CrudWorkspace';
import LoginPage from './components/LoginPage';
import SettingsWorkspace from './components/SettingsWorkspace';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActionButton,
  AlertDialogCancel,
  AlertDialogCancelButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { crudModules, settingsModule } from './data/crudConfig';
import { useAuth } from './hooks/useAuth';

const moduleConfigs = {
  ...crudModules,
  Settings: settingsModule,
};

const pageRoutes = {
  Dashboard: '/',
  Members: '/members',
  Staff: '/staff',
  Equipment: '/equipment',
  Classes: '/classes',
  Financials: '/financials',
  Settings: '/settings',
};

const routePages = Object.fromEntries(Object.entries(pageRoutes).map(([page, route]) => [route, page]));

function getActivePage(pathname) {
  return routePages[pathname] || 'Dashboard';
}

function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navExpanded, setNavExpanded] = useState(false);
  const [requestedAction, setRequestedAction] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date());
  const activePage = getActivePage(location.pathname);
  const moduleConfig = moduleConfigs[activePage];
  const navigateToPage = (page) => {
    navigate(pageRoutes[page] || '/');
  };
  const handleUtilityAction = (action) => {
    if (action === 'Add Member') {
      navigateToPage('Members');
      setRequestedAction('create');
      return;
    }

    if (action === 'Logout') {
      setLogoutOpen(true);
      return;
    }

    navigateToPage(action);
  };
  const handleQuickAction = (action) => {
    const actionMap = {
      'Add New Member': { page: 'Members', action: 'create' },
      'Staff Schedule': { page: 'Staff' },
      'Inventory Check': { page: 'Equipment' },
      'Revenue Reports': { page: 'Financials' },
    };
    const nextAction = actionMap[action];

    if (!nextAction) {
      return;
    }

    navigateToPage(nextAction.page);
    setRequestedAction(nextAction.action || null);
  };
  const handleLogin = async (credentials) => {
    await login(credentials);
    navigate('/');
  };
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setRequestedAction(null);
  };

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary-container" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar
        activeItem={activePage}
        expanded={navExpanded}
        onNavigate={navigateToPage}
        onToggleExpanded={() => setNavExpanded((current) => !current)}
        onUtility={handleUtilityAction}
      />

      <main className={`flex-1 flex min-h-screen flex-col overflow-y-auto transition-[margin] duration-300 ${navExpanded ? 'md:ml-[280px]' : 'md:ml-[112px]'}`}>
        <Header />

        <div className="w-full max-w-7xl flex-1 px-6 pb-6 pt-4 mx-auto flex flex-col gap-gutter">
          <section className="flex flex-col gap-5 animate-fade-in-up lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-headline text-headline-lg font-bold text-on-surface">
                {activePage === 'Dashboard' ? 'Welcome back, Manager!' : moduleConfig?.title || 'Logout'}
              </h2>
              <p className="mt-1 text-on-surface-variant">
                {activePage === 'Dashboard'
                  ? "Here is the daily breakdown of Titan Gym's performance."
                  : moduleConfig?.description || 'Review the current manager session before signing out.'}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
              <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-pill border border-surface-variant bg-surface-container-lowest px-5 py-3 text-sm font-medium text-on-surface shadow-sm sm:self-auto">
                <Calendar className="h-[18px] w-[18px] text-on-surface-variant" />
                Today, {todayLabel}
              </div>
            </div>
          </section>

          <Routes>
            <Route
              path="/"
              element={(
                <>
                  <div className="grid grid-cols-1 gap-gutter md:grid-cols-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <MembershipCard />
                    <RevenueCard />
                  </div>

                  <div className="grid grid-cols-1 gap-gutter md:grid-cols-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <CheckinsChart />
                    <StatsCards />
                    <BusinessTargets />
                  </div>

                  <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-headline text-headline-md font-semibold text-on-surface">Quick Actions</h3>
                        <p className="mt-1 text-sm text-on-surface-variant">Fast paths for the tasks managers use most.</p>
                      </div>
                    </div>
                    <ActionCards onAction={handleQuickAction} />
                  </section>
                </>
              )}
            />
            <Route path="/settings" element={<SettingsWorkspace config={moduleConfigs.Settings} />} />
            {Object.keys(crudModules).map((page) => (
              <Route
                key={page}
                path={pageRoutes[page]}
                element={(
                  <CrudWorkspace
                    moduleKey={page}
                    config={moduleConfigs[page]}
                    requestedAction={requestedAction}
                    onActionHandled={() => setRequestedAction(null)}
                  />
                )}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="max-w-[460px] gap-7 rounded-[2rem] px-8 py-9 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary-container text-primary">
            <LogOut className="h-10 w-10" strokeWidth={2.25} />
          </div>
          <AlertDialogHeader className="items-center space-y-3">
            <AlertDialogTitle className="text-[24px] leading-8">Sign out?</AlertDialogTitle>
            <AlertDialogDescription className="max-w-sm text-base leading-6">
              Your local manager session will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AlertDialogCancelButton className="h-14">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogCancelButton>
            <AlertDialogActionButton className="h-14 bg-inverse-surface text-inverse-on-surface">
              <AlertDialogAction onClick={handleLogout}>Sign out</AlertDialogAction>
            </AlertDialogActionButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
