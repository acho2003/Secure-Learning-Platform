import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Announcement, Resource } from '../types';
import { getAnnouncements, getResources, uploadResource, downloadResourceFile } from '../services/apiService';

const AnnouncementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.239 9.168-5.584M9 16l-1-5" /></svg>
);
const ResourceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);

const InstructorDashboard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [announcementsData, resourcesData] = await Promise.all([getAnnouncements(), getResources()]);
      setAnnouncements(announcementsData);
      setResources(resourcesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) {
        alert("Please select a file to upload.");
        return;
    }
    try {
        await uploadResource(fileToUpload);
        setFileToUpload(null);
        (e.target as HTMLFormElement).reset();
        fetchData(); // Refresh data
    } catch (err) {
        alert("Failed to upload resource.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {error && <p className="text-red-500">{error}</p>}
        {/* Announcements Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><AnnouncementIcon /> Announcements</h2>
          <div className="space-y-4">
            {isLoading ? <p>Loading announcements...</p> : announcements.map(ann => (
              <div key={ann._id} className="p-4 border rounded-md dark:border-gray-700">
                <h4 className="font-bold">{ann.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">by {ann.author.username} on {new Date(ann.createdAt).toLocaleDateString()}</p>
                <p className="mt-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><ResourceIcon /> Learning Materials</h2>
           <form onSubmit={handleUploadResource} className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Upload New Resource</h3>
            <div>
                <label htmlFor="file-upload-input-instr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">File</label>
                <input id="file-upload-input-instr" type="file" onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Upload</button>
          </form>
          <ul className="space-y-2">
             {isLoading ? <p>Loading resources...</p> : resources.map(res => (
              <li key={res._id} className="p-3 border rounded-md dark:border-gray-700 flex justify-between items-center">
                <div>
                  <span className="font-medium">{res.originalname}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">by {res.uploadedBy.username} - {(res.size / 1024).toFixed(2)} KB</span>
                </div>
                <button onClick={() => downloadResourceFile(res._id, res.originalname)} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Download</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;