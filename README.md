# HR Workflow Designer – Frontend Prototype

A mini HR workflow designer built using **React + React Flow**, featuring drag-and-drop workflow creation, dynamic configuration forms, workflow validation, and a mock workflow simulation engine.

## How to Run

```bash
git clone <your-repo-url>
cd hr-workflow-designer
npm install
npm start
```

Runs at: **http://localhost:3000**

---

# Architecture

```
src/
  api/
    actions.js           # Automated action definitions (mock API)
    simulate.js          # Mock /simulate backend
    workflows.js         # Workflow persistence placeholder
  components/
    WorkflowDesigner/
      WorkflowDesigner.js
      WorkflowCanvas.js
      NodeSidebar.js
      SimulationPanel.js
    nodes/
      StartNode.js
      TaskNode.js
      ApprovalNode.js
      ConditionNode.js
      AutomatedNode.js
      EndNode.js
  domain/
    simulation.js        # Graph validation + execution logic
  hooks/
    useActions.js
    useWorkflowValidation.js
  App.js
  index.js
```

---

## Key Layers

### **1. Canvas Layer (`WorkflowCanvas.js`)**

- Drag-and-drop node placement
- Node palette
- Edge creation
- Node/edge deletion
- React Flow integration

### **2. Node Components (`components/nodes/`)**

- Each node type has its own UI component
- Purely visual representation
- Easily extensible

### **3. Dynamic Node Form Panel (`NodeSidebar.js`)**

Supports per-node-type configurations:

- **Start:** metadata (key-value), title
- **Task:** assignee, due date, description, custom fields
- **Approval:** approver role, auto-approve threshold
- **Automated:** action selector + dynamic parameters
- **End:** summary flag, end message

### **4. Domain Logic (`simulation.js`)**

- Workflow structure validation
- Detects cycles, unreachable nodes, invalid flows
- Step-by-step workflow simulation

### **5. Mock APIs (`api/`)**

- `/actions` – returns actionable automated steps
- `/simulate` – simulates entire workflow
- `/workflows` – placeholder for save/load

### **6. Hooks (`hooks/`)**

- `useActions()` – loads actions from mock API
- `useWorkflowValidation()` – live workflow validation

---

# Workflow Testing / Sandbox Panel

The sandbox performs full backend-style workflow execution:

### **Features**

- Accepts test context (JSON)
- Serializes full workflow graph
- Sends to mock `/simulate` API
- Shows structural validation errors
- Displays a step-by-step execution log

### **Example Output**

```
1. [START] Starting workflow at "Employee Onboarding Start".
2. [TASK] Collect Documents assigned to HR Executive.
3. [APPROVAL] Manager Approval (threshold: 3)
4. [AUTOMATED] Send Welcome Email using action 'send_email'
5. [END] Workflow completed. Summary flag: ON
```

---

# Completed Features

### **Canvas**

- Drag, drop, connect, delete
- Node palette
- Selection + property editing
- FitView + minimap

### **Node Types**

- Start
- Task
- Approval
- Automated
- Condition (basic)
- End

### **Forms**

- Fully dynamic based on node type
- Controlled forms
- Key-value metadata + custom fields
- Dynamic automated action parameters

### **Validation**

- Start node rules
- End node requirement
- No outgoing edges
- Unreachable nodes
- Cycle detection

### **Simulation**

- Graph serialization
- Context-aware execution
- Mock backend simulation
- Step-by-step log

---

# What Could Be Added With More Time

- Full condition branch editor (if/else UI)
- Auto-layout engine (DAGRE/ELK)
- Real workflow save/load with versioning
- Better simulation timeline UI
- TypeScript for full type safety
- Unit tests for domain logic (validateGraph, runSimulation)
- Multi-select, grouping, and undo/redo

---

# Summary

This project demonstrates:

- Clean and scalable architecture
- Strong React Flow usage
- Dynamic, extensible configuration forms
- Clear separation of UI, domain, and API layers
- Workflow validation and mock simulation
- Thoughtful component and module design

Perfect for evaluating a front-end engineer’s ability to architect complex, interactive systems.
