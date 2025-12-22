import React, { useMemo, useState, useEffect } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Header from "../../Components/Header.jsx";
import hrmsData from "../../data/hrmsData.json";

ModuleRegistry.registerModules([AllCommunityModule]);

const Account = () => {
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    setRowData(hrmsData.accounts);
  }, []);

  const [columnDefs] = useState([
    { field: "id" },
    { field: "date" },
    { field: "accType" },
    { field: "description" },
    { field: "amount" },
    { field: "transType" },
    { field: "status" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "120px 40px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      <Header title="ACCOUNTS" subtitle="Org - Financial Transactions" />
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default Account;
