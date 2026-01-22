import { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateSampleData } from './data/sampleData';
import { Header } from './components/Layout/Header';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { TimeEntryPage } from './pages/TimeEntryPage';
import { ReviewPage } from './pages/ReviewPage';
import { ReflectionPage } from './pages/ReflectionPage';
import { SummaryPage } from './pages/SummaryPage';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [editingEntry, setEditingEntry] = useState(null);

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
  } = useLocalStorage();

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
  };

  const handleEditFromReview = (entry) => {
    setEditingEntry(entry);
    setCurrentStep('entry');
  };

  const handleComplete = () => {
    markComplete();
    // In a real app, this might redirect to the next lesson
    alert('Audit completed! Your data has been saved.');
  };

  const handleClearAll = () => {
    clearAllData();
  };

  // Welcome screen (no header)
  if (currentStep === 'welcome') {
    return (
      <WelcomeScreen
        onStart={handleStart}
        onLoadSample={handleLoadSample}
        hasExistingData={hasExistingData}
      />
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
          onAddEntry={addEntry}
          onUpdateEntry={updateEntry}
          onDeleteEntry={deleteEntry}
          onClearAll={handleClearAll}
          onContinue={() => setCurrentStep('review')}
          editingEntry={editingEntry}
        />
      )}

      {currentStep === 'review' && (
        <ReviewPage
          entries={entries}
          onEdit={handleEditFromReview}
          onDelete={deleteEntry}
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
    </div>
  );
}

export default App;
