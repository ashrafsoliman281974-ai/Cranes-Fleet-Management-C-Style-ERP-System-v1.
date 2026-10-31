import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { DualSidebar } from './components/layout/DualSidebar';
import { TopHeader } from './components/layout/TopHeader';
import { WorkspaceHome } from './components/workspace/WorkspaceHome';
import { SalesInvoiceForm } from './components/sales/SalesInvoiceForm';
import { InvoiceListView } from './components/sales/InvoiceListView';
import { GeneralLedger } from './components/reports/GeneralLedger';
import { PermissionManager } from './components/permissions/PermissionManager';
import { LoginPage } from './components/login/LoginPage';
import { LoginPageSettings } from './components/login/LoginPageSettings';
import { ThemeModal } from './components/theme/ThemeModal';
import { TranslationModal } from './components/translation/TranslationModal';

// New Enterprise Modules
import { JournalEntryForm } from './components/accounting/JournalEntryForm';
import { JournalEntryListView } from './components/accounting/JournalEntryListView';
import { CostCentersView } from './components/accounting/CostCentersView';
import { UserManagementView } from './components/users/UserManagementView';
import { ContractForm } from './components/contracts/ContractForm';
import { ContractListView } from './components/contracts/ContractListView';
import { GateOperationsBoard } from './components/gate/GateOperationsBoard';
import { BackupView } from './components/backup/BackupView';
import { EgyptCranesFleetView } from './components/egyptcranes/EgyptCranesFleetView';
import { TreasuryView } from './components/treasury/TreasuryView';
import { InventoryWarehouseView } from './components/inventory/InventoryWarehouseView';
import { FinancialStatementsView } from './components/accounting/FinancialStatementsView';
import { EquipmentCostingView } from './components/accounting/EquipmentCostingView';
import { BudgetManagementView } from './components/accounting/BudgetManagementView';
import { DailyOperationsView } from './components/operations/DailyOperationsView';
import { FleetMaintenanceView } from './components/maintenance/FleetMaintenanceView';

const MainLayout: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeInvoice,
    activeJournalEntry,
    activeContract,
    toastMessage,
  } = useERP();

  if (activeView === 'login-preview') {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden text-slate-800">
      {/* Dual Sidebar (Rightmost in RTL) */}
      <DualSidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Viewport Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70">
          {activeView === 'workspace' && <WorkspaceHome />}
          {activeView === 'fleet' && <EgyptCranesFleetView />}
          {(activeView === 'maintenance' || activeView === 'fleet-maintenance') && <FleetMaintenanceView />}
          {activeView === 'daily-operations' && <DailyOperationsView />}
          {activeView === 'gate-ops' && <GateOperationsBoard />}
          {activeView === 'contracts' && <ContractListView />}
          {activeView === 'new-contract' && (
            <ContractForm
              contract={activeContract}
              onBack={() => setActiveView('contracts')}
            />
          )}
          {activeView === 'journals' && <JournalEntryListView />}
          {activeView === 'new-jv' && (
            <JournalEntryForm
              entry={activeJournalEntry}
              onBack={() => setActiveView('journals')}
            />
          )}
          {activeView === 'cost-centers' && <CostCentersView />}
          {activeView === 'treasury' && <TreasuryView />}
          {activeView === 'inventory' && <InventoryWarehouseView />}
          {activeView === 'users' && <UserManagementView />}
          {activeView === 'backup' && <BackupView />}
          {activeView === 'invoices' && <InvoiceListView />}
          {activeView === 'new-invoice' && (
            <SalesInvoiceForm
              invoice={activeInvoice}
              onBack={() => setActiveView('invoices')}
            />
          )}
          {activeView === 'ledger' && <GeneralLedger />}
          {activeView === 'financial-statements' && <FinancialStatementsView />}
          {activeView === 'equipment-costing' && <EquipmentCostingView />}
          {activeView === 'budget-management' && <BudgetManagementView />}
          {activeView === 'permissions' && <PermissionManager />}
          {activeView === 'login-settings' && <LoginPageSettings />}
        </main>
      </div>

      {/* Global Modals */}
      <ThemeModal />
      <TranslationModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainLayout />
    </ERPProvider>
  );
}
