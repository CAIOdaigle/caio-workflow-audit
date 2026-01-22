import { Play, Clock, BarChart3, MessageSquare, FileText, Download } from 'lucide-react';

export const WelcomeScreen = ({ onStart, onLoadSample, hasExistingData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F9F9] to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="ChiefAIOfficer.com" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#000221] mb-3">
            Workflow Audit
          </h1>
          <p className="text-gray-500">Week 6, Module 1</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-[#000221] mb-4">
            Understand Where Your Time Actually Goes
          </h2>
          <p className="text-gray-600 mb-6">
            This tool helps you reconstruct the last two weeks of your work, categorize each time block,
            and discover patterns in how you spend your time as a Chief AI Officer.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#e6ebff] rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-[#0038ff]" />
              </div>
              <div>
                <p className="font-medium text-[#000221] text-sm">Log Time Blocks</p>
                <p className="text-xs text-gray-500">Record activities from your calendar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-[#000221] text-sm">See Your Distribution</p>
                <p className="text-xs text-gray-500">Visualize time across 6 categories</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FFF6E8] rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare size={16} className="text-[#E8A87C]" />
              </div>
              <div>
                <p className="font-medium text-[#000221] text-sm">Reflect & Analyze</p>
                <p className="text-xs text-gray-500">Identify automation opportunities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-[#000221] text-sm">Export Your Report</p>
                <p className="text-xs text-gray-500">Download PDF or CSV for records</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onStart}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0038ff] text-white font-medium rounded-lg hover:bg-[#0030dd] transition-colors"
            >
              <Play size={20} />
              {hasExistingData ? 'Continue Your Audit' : 'Start Your Audit'}
            </button>

            {!hasExistingData && (
              <button
                onClick={onLoadSample}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={20} />
                Load Sample Data
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Pull up your calendar before starting. You'll categorize each time block
          into one of six CAIO work categories.
        </p>
      </div>
    </div>
  );
};
