import { create } from "zustand";
export const useGoalStore = create((set) => ({
  goals: [],
  currentGoal: null,
  isLoading: false,
  setGoals: (goals) =>
    set({
      goals,
    }),
  setCurrentGoal: (goal) =>
    set({
      currentGoal: goal,
    }),
  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, goal],
    })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...updates,
            }
          : goal,
      ),
    })),
  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    })),
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}));
