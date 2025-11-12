import { useState } from 'react';
import { CheckInPromptData, formatMinutes } from '@trackme/shared';

interface CheckInPromptProps {
  data: CheckInPromptData;
  onSubmit: (data: any) => void;
  onSnooze: () => void;
  onSkip: () => void;
}

export function CheckInPrompt({ data, onSubmit, onSnooze, onSkip }: CheckInPromptProps) {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [startTime, setStartTime] = useState(data.startTime);
  const [endTime, setEndTime] = useState(data.endTime);

  const handleSubmit = () => {
    const activityName = customActivity || selectedActivity;
    if (!activityName) return;

    const suggestion = data.suggestions.find((s) => s.name === activityName);

    onSubmit({
      activityType: activityName,
      activityDescription: customActivity ? activityName : undefined,
      startTime,
      endTime,
      duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60),
      category: suggestion?.category || 'Other',
      isMeeting: suggestion?.type === 'meeting'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            You were away for {formatMinutes(data.duration)}
          </h2>
          <p className="text-sm text-gray-600 mt-1">What were you doing?</p>
        </div>

        {/* Quick Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Quick Select</label>
          <div className="grid grid-cols-3 gap-2">
            {data.suggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion.name}
                onClick={() => {
                  setSelectedActivity(suggestion.name);
                  setCustomActivity('');
                }}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedActivity === suggestion.name
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{suggestion.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{suggestion.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Activity */}
        <div className="mb-6">
          <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-2">
            Or type activity
          </label>
          <input
            id="custom"
            type="text"
            value={customActivity}
            onChange={(e) => {
              setCustomActivity(e.target.value);
              setSelectedActivity('');
            }}
            placeholder="e.g., Client meeting, Research..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Time Adjustment */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">From:</span>
              <span className="ml-2 font-medium">
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-gray-600">To:</span>
              <span className="ml-2 font-medium">
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{formatMinutes(data.duration)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onSnooze}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Snooze 30m
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedActivity && !customActivity}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
