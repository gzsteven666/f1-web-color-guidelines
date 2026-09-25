import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TEAMS_DATA, TeamViewData, TEAMS_LIST } from '@/data/teamsData';
import { SurfacePageInstance } from '@/types/surface';

interface TeamContextType {
  currentTeam: TeamViewData;
  setTeamId: (id: string) => void;
  allTeams: TeamViewData[];
  registerPageInstance: (instance: SurfacePageInstance | null) => void;
}

const TeamContext = createContext<TeamContextType | null>(null);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTeamId, setCurrentTeamId] = useState<string>('mercedes');
  const pageInstanceRef = useRef<SurfacePageInstance | null>(null);

  const registerPageInstance = useCallback((instance: SurfacePageInstance | null) => {
    pageInstanceRef.current = instance;
  }, []);

  const setTeamId = useCallback((id: string) => {
    const target = TEAMS_DATA[id];
    if (!target) return;
    setCurrentTeamId(id);

    // 动态通知三维渲染核心切换车队预设
    if (pageInstanceRef.current) {
      pageInstanceRef.current.setPreset(target.preset);
    }
  }, []);

  const currentTeam = TEAMS_DATA[currentTeamId] || TEAMS_DATA.mercedes;

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        setTeamId,
        allTeams: TEAMS_LIST,
        registerPageInstance,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export function useTeam(): TeamContextType {
  const ctx = useContext(TeamContext);
  if (!ctx) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return ctx;
}
