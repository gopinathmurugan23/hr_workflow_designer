import { useEffect, useState } from "react";
import { validateGraph } from "../domain/simulation";

export function useWorkflowValidation(nodes, edges) {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const errs = validateGraph(nodes, edges);
    setErrors(errs);
  }, [nodes, edges]);

  return errors;
}
