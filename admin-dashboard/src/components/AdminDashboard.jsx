import React, { useState, useEffect } from 'react';
import { read, utils, writeFile } from 'xlsx';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  Search,
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  Send,
  X,
  MoreVertical,
  ArrowUpRight,
  Activity,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', users: 65 },
  { name: 'Feb', users: 80 },
  { name: 'Mar', users: 95 },
  { name: 'Apr', users: 120 },
  { name: 'May', users: 150 },
  { name: 'Jun', users: 180 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastActive: '2024-02-11' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', lastActive: '2024-02-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', lastActive: '2024-02-09' },
  ]);
  const [excelData, setExcelData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(true);
  const [showExcelPreview, setShowExcelPreview] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Simulate upload progress
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            setIsUploading(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const UserModal = ({ user, onClose }) => (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {user ? 'Update user information' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              defaultValue={user?.name}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg"
              defaultValue={user?.email}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            <select className="w-full p-2 border rounded-lg" defaultValue={user?.role}>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {user ? 'Update' : 'Create'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const MetricCard = ({ icon: Icon, title, value, trend, color, isGradient }) => (
    <Card className={`transform transition-all duration-200 hover:scale-105 overflow-hidden ${
      isGradient ? 'relative' : ''
    }`}>
      {isGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E15D47] to-[#FFD46B]" />
      )}
      <CardContent className={`p-6 relative ${isGradient ? 'text-white' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${
            isGradient 
              ? 'bg-white bg-opacity-20' 
              : 'bg-opacity-20'
          }`} style={{ backgroundColor: isGradient ? undefined : `${color}20` }}>
            <Icon 
              size={24} 
              className={isGradient ? 'text-white' : undefined}
              style={{ color: isGradient ? undefined : color }} 
            />
          </div>
          <div className={`text-sm font-medium flex items-center gap-1 ${
            isGradient 
              ? 'text-white' 
              : (trend > 0 ? 'text-green-500' : 'text-red-500')
          }`}>
            <ArrowUpRight 
              size={16} 
              className={trend > 0 ? '' : 'rotate-180'} 
            />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        </div>
        <h3 className={`text-lg font-medium mb-1 ${
          isGradient ? 'text-white' : 'text-[#273342]'
        }`}>{title}</h3>
        <p className={`text-3xl font-bold ${
          isGradient ? 'text-white' : ''
        }`}>{value}</p>
      </CardContent>
    </Card>
  );


  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={Users}
          title="Total Users"
          value={users.length}
          trend={12}
          color="#55ADFF"
        />
        <MetricCard
          icon={Activity}
          title="Active Users"
          value={users.filter(u => u.status === 'Active').length}
          trend={8}
          color="#E15D47"
        />
        <MetricCard
          icon={ArrowUpRight}
          title="Growth Rate"
          value="15%"
          trend={5}
          isGradient={true}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Growth Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#55ADFF"
                strokeWidth={2}
                dot={{ fill: '#55ADFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderChatSection = () => (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Chatbot</CardTitle>
          <CardDescription>Ask questions about the dashboard and user management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'p-2 bg-[#E15D47] text-white rounded-2xl hover:bg-opacity-90'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      { sender: 'user', text: newMessage },
                      { sender: 'bot', text: 'I understand your question. Let me help you with that.' }
                    ]);
                    setNewMessage('');
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E15D47]"
              />
              <button
                onClick={() => {
                  if (newMessage.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      { sender: 'user', text: newMessage },
                      { sender: 'bot', text: 'I understand your question. Let me help you with that.' }
                    ]);
                    setNewMessage('');
                  }
                }}
                className={`${primaryButtonStyles} p-3`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleExportToExcel = () => {
    const ws = utils.json_to_sheet(users);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, "users_export.xlsx");
  };

  const renderExcelSection = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Excel Data Management</CardTitle>
        <div className="flex gap-2">
          <button className={`${primaryButtonStyles} px-4 py-2`}>
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </button>
          <label className={`${secondaryButtonStyles} px-4 py-2 cursor-pointer`}>
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </CardHeader>
      <CardContent>
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}
        
        {excelData && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {Object.keys(excelData[0]).map((header) => (
                    <th key={header} className="px-6 py-3 text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setShowUserModal(true);
                }}
                className={`${primaryButtonStyles} px-4 py-2`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Last Active</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.lastActive}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-500 mr-2 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      case 'excel':
        return renderExcelSection();
      case 'chat':
        return renderChatSection();
      default:
        return renderDashboard();
      // ... rest of the cases remain similar but with updated styling
    }
  };

  const SidebarItem = ({ icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(label.toLowerCase());
        if (window.innerWidth < 768) {
          setIsMobileMenuOpen(false);
        }
      }}
      className={`flex items-center w-full rounded-2xl transition-colors
        ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'}
        py-3
        ${activeTab === label.toLowerCase()
          ? 'bg-[#E15D47] bg-opacity-10 text-[#E15D47]'
          : 'hover:bg-gray-50'
        }`}
    >
      <div className="flex-shrink-0 flex items-center justify-center">
        <Icon size={24} />
      </div>
      <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
        {label}
      </span>
    </button>
  );


  const buttonBaseStyles = "rounded-2xl transition-all duration-200 flex items-center justify-center";
  const primaryButtonStyles = `${buttonBaseStyles} bg-[#E15D47] hover:bg-[#d54d3a] text-white`;
  const secondaryButtonStyles = `${buttonBaseStyles} bg-[#FFD46B] hover:bg-[#ffc945] text-[#273342]`;
  const outlineButtonStyles = `${buttonBaseStyles} border-2 border-[#E15D47] text-[#E15D47] hover:bg-[#E15D47] hover:text-white`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          <div className="flex-shrink-0">
            <Menu size={24} />
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`flex items-center justify-between ${isSidebarCollapsed ? 'p-4' : 'p-6'}`}>
            <h1 className={`text-2xl font-bold text-[#273342] ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
              Admin
            </h1>
            <button
              onClick={toggleSidebar}
              className={`rounded-lg hover:bg-gray-100 hidden md:flex items-center justify-center
                ${isSidebarCollapsed ? 'w-12 h-12' : 'p-2'}`}
            >
              <div className="flex-shrink-0">
                {isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isSidebarCollapsed ? 'px-2' : 'px-4'} space-y-2`}>
            {[
              { icon: LayoutDashboard, label: 'Dashboard' },
              { icon: Users, label: 'Users' },
              { icon: FileSpreadsheet, label: 'Excel' },
              { icon: MessageSquare, label: 'Chat' }
            ].map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className={`${isSidebarCollapsed ? 'p-2' : 'p-6'}`}>
            <button 
              className={`flex items-center w-full rounded-2xl hover:bg-gray-50 transition-colors
                ${isSidebarCollapsed ? 'justify-center p-3' : 'p-3'}
              `}
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                <Settings size={24} className="text-gray-600" />
              </div>
              <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h2 className="text-2xl font-bold text-[#273342]">
                Welcome Back, Admin
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E15D47]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {selectedUser !== undefined && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(undefined)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;