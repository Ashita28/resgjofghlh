import React, { useEffect, useMemo } from "react";
import styles from "./componentStyles/cheforderTable.module.css";
import {
  useGetChefsQuery,
  useAssignChefMutation,
  useCreateChefsMutation,
} from "../redux/chefsApi";

// Hard-coded visual order & names (requirement)
const FIXED_CHEF_NAMES = ["Manesh", "Pritam", "Yash", "Tenzen"];

const ChefOrderTable = () => {
  const { data, isLoading, isError, error, refetch } = useGetChefsQuery();
  const [assignChef, { isLoading: assigning }] = useAssignChefMutation();
  const [createChefs] = useCreateChefsMutation();

  // Optional: auto-seed 4 chefs if DB is empty
  useEffect(() => {
    if (!isLoading && !isError && (data?.total ?? 0) === 0) {
      (async () => {
        try {
          await createChefs(
            FIXED_CHEF_NAMES.map((name) => ({ name, noOfOrdersTaken: 0 }))
          );
          refetch();
        } catch (e) {
          // non-fatal for UI
          console.error("Seeding chefs failed:", e);
        }
      })();
    }
  }, [isLoading, isError, data?.total, createChefs, refetch]);

  // Make a quick lookup: name -> count
  const nameToCount = useMemo(() => {
    const map = new Map();
    (data?.chefs ?? []).forEach((c) => map.set(c.name, c.noOfOrdersTaken));
    return map;
  }, [data]);

  // Render list strictly in FIXED_CHEF_NAMES order,
  // filling counts from API or 0 if not present.
  const rows = useMemo(
    () =>
      FIXED_CHEF_NAMES.map((name) => ({
        name,
        noOfOrdersTaken: nameToCount.get(name) ?? 0,
      })),
    [nameToCount]
  );

  const handleAssign = async () => {
    const res = await assignChef();
    if ("error" in res) {
      console.error(res.error);
    } else {
      refetch(); // be extra-snappy
    }
  };

  if (isLoading) {
    return (
      <div className={styles.tableContainer}>
        <p>Loading chefs…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.tableContainer}>
        <p style={{ color: "crimson" }}>
          {error?.data?.error || "Failed to load chef data"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>

      <table className={styles.chefTable}>
        <thead>
          <tr>
            <th>Chef Name</th>
            <th>Order Taken</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((chef) => (
            <tr key={chef.name}>
              <td>{chef.name}</td>
              {/* changed from padStart(2, '0') to just show normal number */}
              <td>{chef.noOfOrdersTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChefOrderTable;
