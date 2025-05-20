import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Loader } from 'lucide-react';

const StreamingData: React.FC = () => {
  const { streamingData } = useTaskContext();

  if (!streamingData || streamingData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Streaming Data</h2>
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin h-6 w-6 text-blue-500" />
          <span className="ml-2 text-gray-500">Loading streaming data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Streaming Data</h2>
      <div className="space-y-4">
        {streamingData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4">
            <h3 className="font-medium">{item.title || 'Stream Item'}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.description || 'No description available'}</p>
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                View Source
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamingData;