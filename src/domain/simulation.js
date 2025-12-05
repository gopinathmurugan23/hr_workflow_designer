/**
 * @typedef {"start"|"task"|"approval"|"automated"|"condition"|"end"} WorkflowNodeType
 */

/**
 * @typedef {Object} WorkflowNodeConfig
 * @property {string} [name]
 * @property {string} [description]
 * @property {Array<{key: string, value: string}>} [metadata]      // start
 * @property {string} [assignee]                                   // task
 * @property {string} [dueDate]                                    // task
 * @property {Array<{key: string, value: string}>} [customFields]  // task
 * @property {string} [approverRole]                               // approval
 * @property {number} [autoApproveThreshold]                       // approval
 * @property {string} [actionId]                                   // automated
 * @property {Object.<string,string>} [actionParams]               // automated params
 * @property {boolean} [summaryFlag]                               // end
 */

/**
 * @typedef {Object} WorkflowNodeData
 * @property {WorkflowNodeType} type
 * @property {WorkflowNodeConfig} config
 */

/**
 * @typedef {Object} WorkflowNode
 * @property {string} id
 * @property {WorkflowNodeType} type
 * @property {{ x: number, y: number }} position
 * @property {WorkflowNodeData} data
 */

export function validateGraph(nodes, edges) {
  const errors = [];

  if (!nodes || nodes.length === 0) {
    errors.push("Workflow is empty.");
    return errors;
  }

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const outgoing = new Map();
  const incoming = new Map();

  edges.forEach((e) => {
    if (!outgoing.has(e.source)) outgoing.set(e.source, []);
    outgoing.get(e.source).push(e);

    if (!incoming.has(e.target)) incoming.set(e.target, []);
    incoming.get(e.target).push(e);
  });

  const getType = (n) => (n.data && n.data.type) || n.type;

  const startNodes = nodes.filter((n) => getType(n) === "start");
  const endNodes = nodes.filter((n) => getType(n) === "end");

  if (startNodes.length === 0) {
    errors.push("Workflow must have a Start node.");
  } else if (startNodes.length > 1) {
    errors.push("Workflow can only have one Start node.");
  }

  if (endNodes.length === 0) {
    errors.push("Workflow should have at least one End node.");
  }

  // Start node must not have incoming edges
  if (startNodes.length === 1) {
    const startId = startNodes[0].id;
    const incomingToStart = edges.filter((e) => e.target === startId);
    if (incomingToStart.length > 0) {
      errors.push("Start node cannot have incoming connections.");
    }
  }

  // Non-end nodes must have at least one outgoing edge
  nodes.forEach((n) => {
    const type = getType(n);
    const outs = outgoing.get(n.id) || [];
    if (type !== "end" && outs.length === 0) {
      errors.push(`Node "${labelForNode(n)}" has no outgoing connections.`);
    }
  });

  // Reachability from Start
  if (startNodes.length === 1) {
    const startId = startNodes[0].id;
    const visited = new Set();
    const queue = [startId];
    visited.add(startId);

    while (queue.length > 0) {
      const currentId = queue.shift();
      const outs = outgoing.get(currentId) || [];
      outs.forEach((e) => {
        if (!visited.has(e.target)) {
          visited.add(e.target);
          queue.push(e.target);
        }
      });
    }

    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        errors.push(
          `Node "${labelForNode(n)}" is unreachable from the Start node.`
        );
      }
    });
  }

  // Cycle detection
  const visited = new Set();
  const inStack = new Set();

  function dfs(nodeId) {
    visited.add(nodeId);
    inStack.add(nodeId);

    const outs = outgoing.get(nodeId) || [];
    for (const e of outs) {
      const target = e.target;
      if (!visited.has(target)) {
        if (dfs(target)) return true;
      } else if (inStack.has(target)) {
        // cycle
        return true;
      }
    }

    inStack.delete(nodeId);
    return false;
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      const hasCycle = dfs(n.id);
      if (hasCycle) {
        errors.push("Workflow contains at least one cycle.");
        break;
      }
    }
  }

  return errors;
}

function labelForNode(node) {
  const data = node.data || {};
  const config = data.config || {};
  const type = data.type || node.type;
  return config.name || `${type} (${node.id})`;
}

// Simulate step-by-step execution
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
        message: `Task: "${config.name || id}" assigned to ${
          config.assignee || "N/A"
        } (due: ${config.dueDate || "N/A"})`,
      });
    } else if (nodeType === "approval") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Approval: "${config.name || id}" by ${
          config.approverRole || "Unknown"
        } (auto-threshold: ${
          config.autoApproveThreshold !== undefined
            ? config.autoApproveThreshold
            : "none"
        })`,
      });
    } else if (nodeType === "automated") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Automated step: "${config.name || id}" using action "${
          config.actionId || "none"
        }"`,
      });
    } else if (nodeType === "condition") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Evaluating condition "${config.name || id}"`,
      });

      const condEdges = outgoing.get(id) || [];
      if (condEdges.length === 0) break;

      // For now, we just follow the first edge
      const nextId = condEdges[0].target;
      current = byId.get(nextId);
      continue;
    } else if (nodeType === "end") {
      steps.push({
        nodeId: id,
        nodeType,
        message: `Reached end: "${config.name || id}". Summary flag: ${
          config.summaryFlag ? "ON" : "OFF"
        }`,
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
