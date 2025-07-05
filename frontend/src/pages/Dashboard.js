import { useQuery } from "react-query"
import { analyticsApi } from "../services/api"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import LoadingSpinner from "../components/LoadingSpinner"
import { AlertCircle, CheckCircle, Clock, Play } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Dashboard() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery("dashboard-stats", analyticsApi.getDashboardStats, {
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600">Error loading dashboard data</div>
  }

  const statusData = stats?.data?.status_counts || []
  const severityData = stats?.data?.severity_counts || []

  const statusChartData = {
    labels: statusData.map((item) => item.status.replace("_", " ").toUpperCase()),
    datasets: [
      {
        label: "Issues by Status",
        data: statusData.map((item) => item.count),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)", // red for open
          "rgba(245, 158, 11, 0.8)", // yellow for triaged
          "rgba(59, 130, 246, 0.8)", // blue for in_progress
          "rgba(34, 197, 94, 0.8)", // green for done
        ],
        borderColor: ["rgba(239, 68, 68, 1)", "rgba(245, 158, 11, 1)", "rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const severityChartData = {
    labels: severityData.map((item) => item.severity.toUpperCase()),
    datasets: [
      {
        label: "Issues by Severity",
        data: severityData.map((item) => item.count),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // green for low
          "rgba(245, 158, 11, 0.8)", // yellow for medium
          "rgba(249, 115, 22, 0.8)", // orange for high
          "rgba(239, 68, 68, 0.8)", // red for critical
        ],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(245, 158, 11, 1)", "rgba(249, 115, 22, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "triaged":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "in_progress":
        return <Play className="h-5 w-5 text-blue-500" />
      case "done":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of issues and system status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Issues</dt>
                <dd className="text-lg font-medium text-gray-900">{stats?.data?.total_issues || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        {statusData.map((item) => (
          <div key={item.status} className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                    {item.status.replace("_", " ")}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{item.count}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Status</h3>
          <Bar data={statusChartData} options={chartOptions} />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues by Severity</h3>
          <Bar data={severityChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
