import { useEffect, useState } from "react";
import { getActions } from "../api/actions";

export function useActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActions().then((list) => {
      setActions(list);
      setLoading(false);
    });
  }, []);

  return { actions, loading };
}
