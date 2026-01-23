import { Play, Clock, BarChart3, MessageSquare, FileText, Download } from 'lucide-react';
import { Button, Card } from '../components/ui';

export const WelcomeScreen = ({ onStart, onLoadSample, hasExistingData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-light/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="ChiefAIOfficer.com" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary-dark mb-3">
            Workflow Audit
          </h1>
          <p className="text-gray-500">Week 6, Module 1</p>
        </div>

        {/* Main Card */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-primary-dark mb-4">
            Understand Where Your Time Actually Goes
          </h2>
          <p className="text-gray-600 mb-8">
            This tool helps you reconstruct the last two weeks of your work, categorize each time block,
            and discover patterns in how you spend your time as a Chief AI Officer.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <FeatureItem
              icon={Clock}
              iconBg="bg-primary-light"
              iconColor="text-primary"
              title="Log Time Blocks"
              description="Record activities from your calendar"
            />
            <FeatureItem
              icon={BarChart3}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              title="See Your Distribution"
              description="Visualize time across 6 categories"
            />
            <FeatureItem
              icon={MessageSquare}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              title="Reflect & Analyze"
              description="Identify automation opportunities"
            />
            <FeatureItem
              icon={FileText}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
              title="Export Your Report"
              description="Download PDF or CSV for records"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={onStart}
              size="lg"
              className="w-full gap-2"
            >
              <Play size={20} />
              {hasExistingData ? 'Continue Your Audit' : 'Start Your Audit'}
            </Button>

            {!hasExistingData && (
              <Button
                onClick={onLoadSample}
                variant="secondary"
                size="lg"
                className="w-full gap-2"
              >
                <Download size={20} />
                Load Sample Data
              </Button>
            )}
          </div>
        </Card>

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500">
          Pull up your calendar before starting. You'll categorize each time block
          into one of six CAIO work categories.
        </p>
      </div>
    </div>
  );
};

// Feature item component for the grid
function FeatureItem({ icon: Icon, iconBg, iconColor, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
