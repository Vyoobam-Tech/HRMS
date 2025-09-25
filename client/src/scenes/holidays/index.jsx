import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import Header from "../../components/Header";
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import hrmsData from "../../data/hrmsData.json"
import { color, maxWidth } from "@mui/system";


ModuleRegistry.registerModules([AllCommunityModule]);

const Holidays = () => {
  const [rowData, setRowData] = useState([]);
  const [gridKey, setGridKey] = useState(0); 
  const fileInputRef = useRef(null);

  const holidaycolumn = [
    {headerName: "Date",
      field: "date",
      valueFormatter: (params) => {
        if(!params.value) return ''
        const [day, month, year] = params.value.split("-")
        const formattedDate = new Date(`${year}-${month}-${day}`)
        return formattedDate.toLocaleDateString("en-Gb", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      }
    },
    {headerName: "Day", field: "day"},
    {headerName: 'Holidays', field: "name"},
    {headerName: "Type", field: "type", maxWidth:90},
    {headerName: "Status",
      valueGetter: (params) => {
        if(!params.data.date) return ''

        const [day, month, year] = params.data.date.split("-")
        const holidayDate = new Date(`${year}-${month}-${day}`)

        const today = new Date()
        today.setHours(0,0,0,0)
        holidayDate.setHours(0,0,0,0)

        return holidayDate < today ? "Completed" : "Active"
      },
      field: "status", 
      maxWidth: 140,
      cellStyle: (params) => {
        if(params.value === 'Completed') {
          return {color : 'red' }
        }
        if(params.value === 'Active') {
          return {color : 'green' }
        }
      }
    },
  ]

  useEffect(() => {
    const saved = localStorage.getItem("holidayData");
    if (saved) {
      setRowData(JSON.parse(saved));
    }
  }, []);

  const getReportData = () => {
    return {
      columns: holidaycolumn,
      data: hrmsData.holidays
    }
  }

  const reportData = getReportData()

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const csvData = result.data;
          setRowData(csvData);
          localStorage.setItem("holidayData", JSON.stringify(csvData));
          setGridKey((prev) => prev + 1);
          e.target.value = null; 
        },
      });
    }
  };

  return (
    <div
      style={{
        height: 450,
        width: 820,
        marginRight: "60px",
        paddingTop: "140px",
        marginLeft: "30px",
      }}
    >
      <Header title="HOLIDAYS" subtitle="Organisation Holidays Details" />

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* <Button
        variant="contained"
        color="primary"
        sx={{ position: "relative", left: "85%", bottom: "10px", gap: 1 }}
        onClick={() => fileInputRef.current.click()}
      >
        Import
        <FileDownloadRoundedIcon />
      </Button> */}

      <AgGridReact
        key={gridKey}
        rowData={reportData.data}
        columnDefs={reportData.columns}
        domLayout="autoHeight"
        onGridReady={(params) => {
          params.api.sizeColumnsToFit()
        }}
      />
    </div>
  );
};

export default Holidays;
