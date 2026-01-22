import { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { generateSampleData } from './data/sampleData';
import { Header } from './components/Layout/Header';
import { ToastContainer } from './components/Toast/Toast';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { TimeEntryPage } from './pages/TimeEntryPage';
import { ReviewPage } from './pages/ReviewPage';
import { ReflectionPage } from './pages/ReflectionPage';
import { SummaryPage } from './pages/SummaryPage';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [editingEntry, setEditingEntry] = useState(null);
  const toast = useToast();

  // Handle storage errors with toast notifications
  const handleStorageError = useCallback((type, message) => {
    if (type === 'error') {
      toast.error(message);
    } else if (type === 'warning') {
      toast.warning(message);
    }
  }, [toast]);

  const {
    entries,
    reflections,
    addEntry,
    updateEntry,
    deleteEntry,
    setEntries,
    updateReflections,
    markComplete,
    clearAllData
  } = useLocalStorage(handleStorageError);

  const hasExistingData = entries.length > 0;

  const canNavigate = useCallback((step) => {
    if (step === 'welcome') return true;
    if (step === 'entry') return true;
    if (step === 'review') return entries.length >= 1;
    if (step === 'reflect') return entries.length >= 1;
    if (step === 'summary') return entries.length >= 1 && reflections.mostSurprisingCategory;
    return false;
  }, [entries.length, reflections.mostSurprisingCategory]);

  const handleStart = () => {
    setCurrentStep('entry');
  };

  const handleLoadSample = () => {
    const sampleData = generateSampleData();
    setEntries(sampleData);
    setCurrentStep('entry');
    toast.success('Sample data loaded successfully!');
  };

  const handleEditFromReview = (entry) => {
    setEditingEntry(entry);
    setCurrentStep('entry');
  };

  const handleComplete = () => {
    markComplete();
    toast.success('Audit completed! Your data has been saved.');
  };

  const handleClearAll = () => {
    clearAllData();
    toast.info('All entries have been cleared.');
  };

  const handleAddEntry = (entry) => {
    addEntry(entry);
    toast.success('Entry added successfully!');
  };

  const handleUpdateEntry = (id, updates) => {
    updateEntry(id, updates);
    toast.success('Entry updated successfully!');
  };

  const handleDeleteEntry = (id) => {
    deleteEntry(id);
    toast.info('Entry deleted.');
  };

  // Welcome screen (no header)
  if (currentStep === 'welcome') {
    return (
      <>
        <WelcomeScreen
          onStart={handleStart}
          onLoadSample={handleLoadSample}
          hasExistingData={hasExistingData}
        />
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        canNavigate={canNavigate}
      />

      {currentStep === 'entry' && (
        <TimeEntryPage
          entries={entries}
          onAddEntry={handleAddEntry}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
          onClearAll={handleClearAll}
          onContinue={() => setCurrentStep('review')}
          editingEntry={editingEntry}
        />
      )}

      {currentStep === 'review' && (
        <ReviewPage
          entries={entries}
          onEdit={handleEditFromReview}
          onDelete={handleDeleteEntry}
          onBack={() => setCurrentStep('entry')}
          onContinue={() => setCurrentStep('reflect')}
        />
      )}

      {currentStep === 'reflect' && (
        <ReflectionPage
          entries={entries}
          reflections={reflections}
          onUpdateReflections={updateReflections}
          onBack={() => setCurrentStep('review')}
          onContinue={() => setCurrentStep('summary')}
        />
      )}

      {currentStep === 'summary' && (
        <SummaryPage
          entries={entries}
          reflections={reflections}
          onComplete={handleComplete}
          onBack={() => setCurrentStep('reflect')}
        />
      )}

      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
}

export default App;
