import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface EVMData {
  bac: number;
  pv: number;
  ev: number;
  ac: number;
}

export interface EVMMetrics {
  cpi: number;
  spi: number;
  cv: number;
  sv: number;
  eac: number;
  vac: number;
  percentComplete: number;
}

interface EVMContextType {
  data: EVMData;
  metrics: EVMMetrics | null;
  updateData: (newData: EVMData) => void;
  calculateMetrics: () => void;
}

const EVMDataContext = createContext<EVMContextType | undefined>(undefined);

export const useEVMData = () => {
  const context = useContext(EVMDataContext);
  if (!context) {
    throw new Error('useEVMData must be used within EVMDataProvider');
  }
  return context;
};

export const EVMDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<EVMData>(() => {
    const saved = localStorage.getItem('evmData');
    return saved ? JSON.parse(saved) : {
      bac: 1000000,
      pv: 600000,
      ev: 550000,
      ac: 580000,
    };
  });

  const [metrics, setMetrics] = useState<EVMMetrics | null>(null);

  const calculateMetrics = () => {
    const cpi = data.ac !== 0 ? data.ev / data.ac : 0;
    const spi = data.pv !== 0 ? data.ev / data.pv : 0;
    const cv = data.ev - data.ac;
    const sv = data.ev - data.pv;
    const eac = cpi !== 0 ? data.bac / cpi : 0;
    const vac = data.bac - eac;
    const percentComplete = data.bac !== 0 ? (data.ev / data.bac) * 100 : 0;

    setMetrics({ cpi, spi, cv, sv, eac, vac, percentComplete });
  };

  const updateData = (newData: EVMData) => {
    setData(newData);
    localStorage.setItem('evmData', JSON.stringify(newData));
  };

  useEffect(() => {
    calculateMetrics();
  }, [data]);

  return (
    <EVMDataContext.Provider value={{ data, metrics, updateData, calculateMetrics }}>
      {children}
    </EVMDataContext.Provider>
  );
};
