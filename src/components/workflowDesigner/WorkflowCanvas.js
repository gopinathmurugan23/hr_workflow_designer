import React, { useCallback, useState, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import StartNode from "../nodes/StartNode";
import TaskNode from "../nodes/TaskNode";
import ApprovalNode from "../nodes/ApprovalNode";
import ConditionNode from "../nodes/ConditionNode";
import EndNode from "../nodes/EndNode";
import AutomatedNode from "../nodes/AutomatedNode";

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  condition: ConditionNode,
  end: EndNode,
  automated: AutomatedNode,
};

const paletteItemStyle = {
  padding: "4px 8px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 12,
  cursor: "grab",
  background: "#fafafa",
};

function WorkflowCanvas({ nodes, edges, setNodes, setEdges, onSelectNode }) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const handleNodeClick = (_, node) => {
    onSelectNode(node);
  };

  // ---- DRAG FROM SIDEBAR ----
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const getDefaultConfig = (type) => {
    switch (type) {
      case "start":
        return { name: "Start", description: "" };
      case "task":
        return {
          name: "Task",
          description: "",
          assigneeRole: "",
          apiEndpoint: "",
        };
      case "approval":
        return {
          name: "Approval",
          description: "",
          approverRole: "",
        };
      case "condition":
        return {
          name: "Condition",
          description: "",
          branches: [],
        };
      case "automated":
        return {
          name: "Automated Step",
          description: "",
          actionType: "",
          apiEndpoint: "",
        };
      case "end":
      default:
        return { name: "End", description: "" };
    }
  };

  const onDrop = (event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");
    if (!type || !reactFlowInstance) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    setNodes((prev) => {
      const id = `${type}_${Date.now()}`;
      const newNode = {
        id,
        type, // important for React Flow
        position,
        data: {
          type,
          config: getDefaultConfig(type),
        },
      };
      return [...prev, newNode];
    });
  };

  // Optional: keep quick-add buttons too (not required, but handy)
  const addTaskNode = () => {
    setNodes((prev) => {
      const id = `task_${prev.length + 1}`;
      const newNode = {
        id,
        type: "task",
        position: { x: 100 + prev.length * 40, y: 100 },
        data: {
          type: "task",
          config: getDefaultConfig("task"),
        },
      };
      return [...prev, newNode];
    });
  };

  return (
    <div
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
      ref={reactFlowWrapper}
    >
      {/* "Sidebar" palette for drag & drop */}
      <div
        style={{
          padding: 8,
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, marginRight: 8 }}>Drag node:</span>

        <div
          style={paletteItemStyle}
          draggable
          onDragStart={(event) => onDragStart(event, "start")}
        >
          Start
        </div>
        <div
          style={paletteItemStyle}
          draggable
          onDragStart={(event) => onDragStart(event, "task")}
        >
          Task
        </div>
        <div
          style={paletteItemStyle}
          draggable
          onDragStart={(event) => onDragStart(event, "approval")}
        >
          Approval
        </div>
        <div
          style={paletteItemStyle}
          draggable
          onDragStart={(event) => onDragStart(event, "automated")}
        >
          Automated
        </div>
        <div
          style={paletteItemStyle}
          draggable
          onDragStart={(event) => onDragStart(event, "condition")}
        >
          Condition
        </div>
        <div
          style={paletteItemStyle}
          draggable
          onDragStart={(event) => onDragStart(event, "end")}
        >
          End
        </div>

        {/* Optional: quick add button */}
        <button onClick={addTaskNode} style={{ marginLeft: "auto" }}>
          + Task
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          deleteKeyCode="Delete" // press Delete key to remove selected node/edge
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default WorkflowCanvas;
