import React, { createContext, useContext, useState } from 'react';

type KidContextType = {
  selectedKid: string | null;
  setSelectedKid: (kid: string | null) => void;
};

const KidContext = createContext<KidContextType>({
  selectedKid: null,
  setSelectedKid: () => {},
});

export const KidProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedKid, setSelectedKid] = useState<string | null>(null);

  return (
    <KidContext.Provider value={{ selectedKid, setSelectedKid }}>
      {children}
    </KidContext.Provider>
  );
};

export const useKid = () => useContext(KidContext);
