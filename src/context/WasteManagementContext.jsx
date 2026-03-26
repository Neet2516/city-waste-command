import React, { createContext, useContext, useState, useEffect } from 'react';
import { binService, statsService, wardService } from '../services';

// Create the context
const WasteManagementContext = createContext();

// Custom hook to use the context
export const useWasteManagement = () => {
  const context = useContext(WasteManagementContext);
  if (!context) {
    throw new Error('useWasteManagement must be used within a WasteManagementProvider');
  }
  return context;
};

// Provider component
export const WasteManagementProvider = ({ children }) => {
  // State
  const [bins, setBins] = useState([]);
  const [stats, setStats] = useState(null);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    wardId: '',
    status: ''
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [binsData, statsData, wardsData] = await Promise.all([
        binService.getAllBins(),
        statsService.getStats(),
        wardService.getWards()
      ]);

      setBins(binsData);
      setStats(statsData);
      setWards(wardsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update bin status with optimistic update
  const updateBinStatus = async (binId, newStatus) => {
    // Optimistic update
    setBins(prevBins => 
      prevBins.map(bin => 
        bin._id === binId 
          ? { ...bin, status: newStatus }
          : bin
      )
    );

    try {
      await binService.updateBinStatus(binId, newStatus);
      // Refresh stats after successful update
      const updatedStats = await statsService.getStats();
      setStats(updatedStats);
    } catch (err) {
      // Revert optimistic update on error
      setBins(prevBins => 
        prevBins.map(bin => 
          bin._id === binId 
            ? { ...bin, status: bin.status }
            : bin
        )
      );
      setError(err.message);
      throw err;
    }
  };

  // Apply filters
  const filteredBins = bins.filter(bin => {
    const matchesWard = !filters.wardId || bin.wardId === parseInt(filters.wardId);
    const matchesStatus = !filters.status || bin.status === filters.status;
    return matchesWard && matchesStatus;
  });

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ wardId: '', status: '' });
  };

  // Initialize data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    // State
    bins: filteredBins,
    stats,
    wards,
    loading,
    error,
    filters,
    
    // Actions
    fetchData,
    updateBinStatus,
    updateFilters,
    clearFilters,
  };

  return (
    <WasteManagementContext.Provider value={value}>
      {children}
    </WasteManagementContext.Provider>
  );
};
