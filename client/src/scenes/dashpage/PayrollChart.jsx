import { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Box, Card, CardContent, Typography } from "@mui/material";

const PayrollChart = ({ data }) => {
    const chartRef = useRef(null);

    function getData() {
        return [
            { label: "Net Salary", value: data?.totalNetPay || 0 },
            { label: "Deductions", value: data?.totalDeductions || 0 },
            // Could add 'Earnings' but Net + Deductions approx = Gross (minus taxes logic) 
            // Better: 'Net Pay' vs 'Deductions' as slices of Gross? 
            // Or 'Earnings' = Net + Deductions. 
            // Let's show Net vs Deductions.
        ];
    }

    useEffect(() => {
        const data = getData();

        const usdShortFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
        });

        const options = {
            container: chartRef.current,
            data,
            series: [
                {
                    type: "pie",
                    angleKey: "value",
                    calloutLabelKey: "label",
                    sectorLabelKey: "value",
                    sectorLabel: {
                        formatter: ({ datum }) => usdShortFormatter.format(datum.value),
                        color: "white",
                        fontWeight: "bold"
                    },
                    fills: ["#34495e", "#ff6b6b"],
                    tooltip: {
                        renderer: ({ datum }) => ({
                            title: datum.label,
                            content: `Value: ${usdShortFormatter.format(datum.value)}`,
                        }),
                    },
                    innerRadiusRatio: 0.6, // Donut chart style
                },
            ],
            legend: {
                enabled: true,
                position: "bottom"
            },
            background: {
                visible: false
            }
        };

        const chart = AgCharts.create(options);

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [data]);

    return (
        <Card
            sx={{
                height: "100%",
                minHeight: "340px",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
        >
            <CardContent>
                <Typography variant="h6" fontWeight="600" color="#34495e" mb={2}>
                    Payroll Distribution
                </Typography>
                <Box
                    ref={chartRef}
                    sx={{
                        width: "100%",
                        height: "280px",
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default PayrollChart;
