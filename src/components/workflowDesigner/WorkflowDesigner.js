import React, { useState } from "react";
import WorkflowCanvas from "./WorkflowCanvas";
import NodeSidebar from "./NodeSidebar";
import SimulationPanel from "./SimulationPanel";
// optional mock API
// import { saveWorkflow } from "../../api/workflows";

function WorkflowDesigner() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeChange = (updatedNode) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
    setSelectedNode(updatedNode);
  };

  // Example save button handler if you use the mock API
  const handleSave = async () => {
    // const dto = { id: "onboarding", name: "Employee Onboarding", nodes, edges };
    // await saveWorkflow(dto);
    // alert("Workflow saved (mock)!");
    console.log("Saving workflow (mock):", { nodes, edges });
    alert("Workflow saved (console only in this demo).");
  };

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <div
        style={{
          flex: 3,
          borderRight: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 8,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0 }}>HR Workflow Designer</h3>
          <button onClick={handleSave}>Save Workflow (Mock)</button>
        </div>

        <div style={{ flex: 1 }}>
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onSelectNode={setSelectedNode}
          />
        </div>
      </div>

      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <NodeSidebar node={selectedNode} onChange={handleNodeChange} />
        <div style={{ borderTop: "1px solid #eee", height: "40%" }}>
          <SimulationPanel nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
}

export default WorkflowDesigner;
