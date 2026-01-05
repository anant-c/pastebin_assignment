'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ViewText() {
  const params = useParams();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch(`/api/text/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setText(data.text);
          setInfo(data);
        } else {
          setError(data.error || 'Failed to load text');
        }
      } catch (err) {
        setError('Failed to load text');
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading text...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Text Not Available
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Create New Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Shared Text</h1>
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create New →
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 break-words">
              {text}
            </pre>
          </div>

          {info && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                {info.maxViews && (
                  <>
                    Views: {info.views} / {info.maxViews}
                    {info.isLastView && ' (This was the last view - link is now expired)'}
                  </>
                )}
                {info.expiresAt && (
                  <>Expires at: {new Date(info.expiresAt).toLocaleString()}</>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}