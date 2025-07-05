"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { useForm } from "react-hook-form"
import { usersApi } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import { Plus, Edit, Trash2, X } from "lucide-react"

function Users() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const {
    data: users,
    isLoading,
    error,
  } = useQuery("users", usersApi.getAll, {
    enabled: currentUser?.role === "admin",
  })

  const createUserMutation = useMutation(usersApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("users")
      toast.success("User created successfully")
      setShowCreateForm(false)
      reset()
    },
    onError: () => {
      toast.error("Failed to create user")
    },
  })

  const updateUserMutation = useMutation(({ id, data }) => usersApi.update(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("users")
      toast.success("User updated successfully")
      setEditingUser(null)
      reset()
    },
    onError: () => {
      toast.error("Failed to update user")
    },
  })

  const deleteUserMutation = useMutation(usersApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries("users")
      toast.success("User deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete user")
    },
  })

  const onSubmit = (data) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data })
    } else {
      createUserMutation.mutate(data)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    reset({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    })
    setShowCreateForm(true)
  }

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingUser(null)
    reset()
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Access denied. Admin role required.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600">Error loading users</div>
  }

  const usersData = users?.data || []

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "maintainer":
        return "bg-blue-100 text-blue-800"
      case "reporter":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user accounts and roles</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="btn btn-primary px-4 py-2 text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{editingUser ? "Edit User" : "Create New User"}</h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username *</label>
                <input
                  type="text"
                  className="input mt-1"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input type="email" className="input mt-1" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" className="input mt-1" {...register("first_name")} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" className="input mt-1" {...register("last_name")} />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    type="password"
                    className="input mt-1"
                    {...register("password", { required: !editingUser ? "Password is required" : false })}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <select className="input mt-1" {...register("role", { required: "Role is required" })}>
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="maintainer">Maintainer</option>
                  <option value="reporter">Reporter</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={handleCancel} className="btn btn-secondary px-4 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={createUserMutation.isLoading || updateUserMutation.isLoading}
                className="btn btn-primary px-4 py-2"
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(user)} className="text-primary-600 hover:text-primary-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usersData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
