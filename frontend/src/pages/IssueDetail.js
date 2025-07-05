"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import { issuesApi } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import { ArrowLeft, Download, MessageCircle, Edit, Trash2, Send } from "lucide-react"

function IssueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showCommentForm, setShowCommentForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { data: issue, isLoading, error } = useQuery(["issue", id], () => issuesApi.getById(id))

  const { data: comments } = useQuery(["issue-comments", id], () => issuesApi.getComments(id), {
    enabled: !!id,
  })

  const updateIssueMutation = useMutation(({ id, data }) => issuesApi.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["issue", id])
      toast.success("Issue updated successfully")
    },
    onError: () => {
      toast.error("Failed to update issue")
    },
  })

  const addCommentMutation = useMutation((data) => issuesApi.addComment(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["issue-comments", id])
      reset()
      setShowCommentForm(false)
      toast.success("Comment added successfully")
    },
    onError: () => {
      toast.error("Failed to add comment")
    },
  })

  const handleStatusChange = (newStatus) => {
    updateIssueMutation.mutate({
      id,
      data: { status: newStatus },
    })
  }

  const handleSeverityChange = (newSeverity) => {
    updateIssueMutation.mutate({
      id,
      data: { severity: newSeverity },
    })
  }

  const onSubmitComment = (data) => {
    addCommentMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600">Error loading issue details</div>
  }

  const issueData = issue?.data
  const commentsData = comments?.data?.results || []

  const canEdit = user?.role !== "reporter" || issueData?.reporter?.id === user?.id
  const canUpdateStatus = user?.role === "admin" || user?.role === "maintainer"

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "triaged":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "done":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/issues")} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </button>

        {canEdit && (
          <div className="flex space-x-2">
            <button className="btn btn-secondary px-3 py-2 text-sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button className="btn btn-danger px-3 py-2 text-sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Issue Details */}
      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{issueData?.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>#{issueData?.id}</span>
              <span>Created by {issueData?.reporter?.email}</span>
              <span>{new Date(issueData?.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            {canUpdateStatus ? (
              <select
                value={issueData?.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input text-sm"
              >
                <option value="open">Open</option>
                <option value="triaged">Triaged</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            ) : (
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(issueData?.status)}`}
              >
                {issueData?.status?.replace("_", " ")}
              </span>
            )}

            {canUpdateStatus ? (
              <select
                value={issueData?.severity}
                onChange={(e) => handleSeverityChange(e.target.value)}
                className="input text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            ) : (
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSeverityColor(issueData?.severity)}`}
              >
                {issueData?.severity}
              </span>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <ReactMarkdown>{issueData?.description}</ReactMarkdown>
        </div>

        {issueData?.file_url && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Attachment</span>
              <a
                href={issueData.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary px-3 py-1 text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Comments ({commentsData.length})</h3>
          <button onClick={() => setShowCommentForm(!showCommentForm)} className="btn btn-primary px-3 py-2 text-sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Comment
          </button>
        </div>

        {showCommentForm && (
          <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6">
            <div className="space-y-3">
              <textarea
                rows={4}
                className="textarea"
                placeholder="Write your comment..."
                {...register("content", { required: "Comment is required" })}
              />
              {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="btn btn-secondary px-3 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addCommentMutation.isLoading}
                  className="btn btn-primary px-3 py-2 text-sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {addCommentMutation.isLoading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {commentsData.map((comment) => (
            <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">{comment.author?.email}</span>
                <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <div className="text-gray-700">
                <ReactMarkdown>{comment.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {commentsData.length === 0 && <p className="text-gray-500 text-center py-4">No comments yet</p>}
        </div>
      </div>
    </div>
  )
}

export default IssueDetail
