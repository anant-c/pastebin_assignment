'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [expirationType, setExpirationType] = useState<'views' | 'time'>('views');
  const [expirationValue, setExpirationValue] = useState('10');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          expirationType,
          expirationValue: parseInt(expirationValue),
        }),
      });

      const data = await response.json();
      if (data.id) {
        const link = `${window.location.origin}/view/${data.id}`;
        setGeneratedLink(link);
      }
    } catch (error) {
      alert('Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Text Share
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Share text securely with expiration options
          </p>

          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white text-gray-900"
                placeholder="Paste or type your text here..."
              />
            </div>

            {/* Expiration Options */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Expiration Settings
              </h3>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setExpirationType('views')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    expirationType === 'views'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  By Views
                </button>
                <button
                  onClick={() => setExpirationType('time')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    expirationType === 'time'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  By Time
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {expirationType === 'views' 
                    ? 'Number of Views' 
                    : 'Hours Until Expiration'}
                </label>
                <input
                  type="number"
                  value={expirationValue}
                  onChange={(e) => setExpirationValue(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent  bg-white text-gray-900"
                  placeholder={expirationType === 'views' ? '10' : '24'}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? 'Generating...' : 'Generate Link'}
            </button>

            {/* Generated Link */}
            {generatedLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
                <h3 className="text-lg font-semibold text-green-800">
                  Link Generated Successfully!
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border border-green-300 rounded-lg text-sm text-green-900"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-green-700">
                  {expirationType === 'views' 
                    ? `This link will expire after ${expirationValue} views` 
                    : `This link will expire in ${expirationValue} hours`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}