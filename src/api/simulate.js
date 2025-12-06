import { validateGraph, runSimulation } from "../domain/simulation";

export function simulateWorkflow(payload) {
  const { nodes, edges, context } = payload;

  return new Promise((resolve) => {
    setTimeout(() => {
      const structureErrors = validateGraph(nodes, edges);

      if (structureErrors.length > 0) {
        resolve({
          ok: false,
          structureErrors,
          steps: [],
          completed: false,
        });
      } else {
        const result = runSimulation(nodes, edges, context || {});
        resolve({
          ok: true,
          structureErrors: [],
          steps: result.steps,
          completed: result.completed,
        });
      }
    }, 400);
  });
}
