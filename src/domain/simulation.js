export function runSimulation(nodes, edges, context) {
  const steps = [];

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const outgoing = new Map();

  edges.forEach((e) => {
    if (!outgoing.has(e.source)) outgoing.set(e.source, []);
    outgoing.get(e.source).push(e);
  });

  const start = nodes.find(
    (n) => (n.data && n.data.type) === "start" || n.type === "start"
  );
  if (!start) {
    steps.push({
      nodeId: "-",
      nodeType: "-",
      message: "No start node defined.",
    });
    return { steps, completed: false };
  }

  let current = start;

  while (current) {
    const id = current.id;
    const data = current.data || {};
    const nodeType = data.type || current.type;
    const config = data.config || {};

    if (nodeType === "task") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Executing task "${config.name || id}"`,
      });
    } else if (nodeType === "approval") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Awaiting approval from ${config.approverRole || "N/A"}`,
      });
    } else if (nodeType === "condition") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Evaluating condition "${config.name || id}"`,
      });

      const condEdges = outgoing.get(id) || [];
      if (condEdges.length === 0) break;

      // For now just follow first branch
      const nextId = condEdges[0].target;
      current = byId.get(nextId);
      continue;
    } else if (nodeType === "end") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Reached end node "${config.name || id}".`,
      });
      return { steps, completed: true };
    } else if (nodeType === "start") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Starting workflow at "${config.name || id}".`,
      });
    }

    const outEdges = outgoing.get(id) || [];
    if (outEdges.length === 0) {
      steps.push({
        nodeId: id,
        nodeType,
        message: "No outgoing edge – stopping.",
      });
      return { steps, completed: false };
    }

    const nextId = outEdges[0].target;
    current = byId.get(nextId);
  }

  return { steps, completed: false };
}
