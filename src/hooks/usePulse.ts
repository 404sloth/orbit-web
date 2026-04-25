import { useState, useCallback } from "react";
import { PulseProject, PulseEvent } from "../types";
import { dashboardApi } from "../services/api";

export function usePulse() {
  const [pulseProjects, setPulseProjects] = useState<PulseProject[]>([]);
  const [pulseTimeline, setPulseTimeline] = useState<PulseEvent[]>([]);
  const [selectedPid, setSelectedPid] = useState<string | null>(null);
  const [pulseLoading, setPulseLoading] = useState(false);

  const loadPulseProjects = useCallback(async () => {
    setPulseLoading(true);
    try {
      const data = await dashboardApi.getProjects();
      setPulseProjects(data);
    } catch (error) {
      console.error("Failed to load Pulse metrics", error);
    } finally {
      setPulseLoading(false);
    }
  }, []);

  const loadPulseTimeline = useCallback(async (projectId: string) => {
    setSelectedPid(projectId);
    setPulseLoading(true);
    try {
      const data = await dashboardApi.getTimeline(projectId);
      setPulseTimeline(data);
    } catch (error) {
      console.error("Failed to load project timeline", error);
    } finally {
      setPulseLoading(false);
    }
  }, []);

  const handleSimulateLifecycle = useCallback(async (projectId: string) => {
    try {
      await dashboardApi.simulateLifecycle(projectId);
      await loadPulseProjects();
      await loadPulseTimeline(projectId);
    } catch (error) {
      console.error("Simulation failed", error);
    }
  }, [loadPulseProjects, loadPulseTimeline]);

  return {
    pulseProjects,
    pulseTimeline,
    selectedPid,
    pulseLoading,
    loadPulseProjects,
    loadPulseTimeline,
    handleSimulateLifecycle,
  };
}
