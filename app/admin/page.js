'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, Users, Activity, Settings, MessageCircle, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState({
        totalDocuments: 0,
        totalUsers: 0,
        totalQueries: 0,
        activeUsers: 0,
    })

    useEffect(() => {
        // TODO: Fetch real stats from API
        setStats({
            totalDocuments: 0,
            totalUsers: 0,
            totalQueries: 0,
            activeUsers: 0,
        })
    }, [])

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-8 h-8 text-primary-600" />
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                SpinWisely AI
                            </h1>
                            <p className="text-xs text-gray-500">Admin Dashboard</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview'
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Activity className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </button>

                    <Link href="/admin/documents">
                        <button
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Documents</span>
                        </button>
                    </Link>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users'
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Users</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'activity'
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Activity className="w-5 h-5" />
                        <span className="font-medium">Activity Logs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings'
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href="/chat">
                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg transition-all">
                            <MessageCircle className="w-4 h-4" />
                            Go to Chat
                        </button>
                    </Link>
                    <button className="w-full flex items-center gap-2 px-4 py-2 mt-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h2>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Documents</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDocuments}</p>
                                        </div>
                                        <FileText className="w-12 h-12 text-primary-600 opacity-20" />
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                                        </div>
                                        <Users className="w-12 h-12 text-accent-600 opacity-20" />
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Queries</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalQueries}</p>
                                        </div>
                                        <Activity className="w-12 h-12 text-green-600 opacity-20" />
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Users</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                                        </div>
                                        <Users className="w-12 h-12 text-blue-600 opacity-20" />
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link href="/admin/documents">
                                        <button className="w-full flex items-center gap-3 px-6 py-4 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                                            <Upload className="w-5 h-5" />
                                            <span className="font-medium">Upload Documents</span>
                                        </button>
                                    </Link>
                                    <button className="w-full flex items-center gap-3 px-6 py-4 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors">
                                        <Users className="w-5 h-5" />
                                        <span className="font-medium">Manage Users</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                        <Activity className="w-5 h-5" />
                                        <span className="font-medium">View Analytics</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">User Management</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">User management interface coming soon...</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Activity Logs</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">Activity logs coming soon...</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">System settings coming soon...</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
