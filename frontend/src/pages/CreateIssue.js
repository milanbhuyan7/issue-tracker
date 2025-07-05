"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "react-query"
import { useForm } from "react-hook-form"
import { useDropzone } from "react-dropzone"
import { issuesApi } from "../services/api"
import toast from "react-hot-toast"
import { Upload, X } from "lucide-react"

function CreateIssue() {
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const createIssueMutation = useMutation(issuesApi.create, {
    onSuccess: () => {
      toast.success("Issue created successfully!")
      navigate("/issues")
    },
    onError: (error) => {
      toast.error("Failed to create issue")
      console.error("Create issue error:", error)
    },
  })

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("severity", data.severity)

    if (file) {
      formData.append("file_attachment", file)
    }

    createIssueMutation.mutate(formData)
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Issue</h1>
        <p className="mt-1 text-sm text-gray-500">Report a bug or request a feature</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                className="input mt-1"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                rows={6}
                className="textarea mt-1"
                placeholder="Describe the issue in detail..."
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              <p className="mt-1 text-sm text-gray-500">You can use Markdown formatting</p>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                Severity *
              </label>
              <select
                id="severity"
                className="input mt-1"
                {...register("severity", { required: "Severity is required" })}
              >
                <option value="">Select severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Attachment (Optional)</label>

              {!file ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? "Drop the file here..." : "Drag & drop a file here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 100MB</p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate("/issues")} className="btn btn-secondary px-4 py-2">
            Cancel
          </button>
          <button type="submit" disabled={createIssueMutation.isLoading} className="btn btn-primary px-4 py-2">
            {createIssueMutation.isLoading ? "Creating..." : "Create Issue"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateIssue
