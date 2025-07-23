"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FlagIcon, 
  UserXIcon, 
  CheckCircleIcon, 
  StarIcon, 
  PlusIcon, 
  UsersIcon, 
  BookOpenIcon,
  BarChart3Icon,
  SettingsIcon,
  AlertCircleIcon
} from "lucide-react"
import { useState, useEffect } from "react"
import StoryEditor from "./story-editor"

type User = {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  role: 'admin' | 'author' | 'reader';
  joinDate: string;
}

// Story status type guard
const isStoryStatus = (status: string): status is 'published' | 'draft' | 'flagged' | 'archived' => {
  return ['published', 'draft', 'flagged', 'archived'].includes(status);
};

// Story status type
type StoryStatus = 'published' | 'draft' | 'flagged' | 'archived';

type Story = {
  id: string;
  title: string;
  author: string;
  status: StoryStatus;
  views: number;
  likes: number;
  publishDate: string;
}

type Report = {
  id: string;
  storyId: string;
  storyTitle: string;
  reason: string;
  reportedBy: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reportedAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showStoryEditor, setShowStoryEditor] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'story' | 'user', id: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Handle story operations
  const handleNewStoryClick = () => {
    setSelectedStory(null);
    setShowStoryEditor(true);
  };
  
  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setShowStoryEditor(true);
  };
  
  // Create a story data object for the editor
  const getEditorStoryData = (story: Story | null) => {
    if (!story) return { title: '', content: '' };
    return {
      title: story.title,
      content: `By ${story.author}\n\n[Content for ${story.title} would be loaded here]`,
      status: story.status,
      // Add other fields as needed by the editor
    };
  };
  
  const handleEditorClose = () => {
    setSelectedStory(null);
    setShowStoryEditor(false);
  };
  
  // Handle user operations
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };
  
  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };
  
  // Handle delete confirmation
  const confirmDelete = (type: 'story' | 'user', id: string) => {
    setItemToDelete({ type, id });
    setShowDeleteConfirm(true);
  };
  
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      // In a real app, this would be an API call to delete the item
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the appropriate state based on the item type
      if (itemToDelete.type === 'user') {
        setUsers(users.filter(user => user.id !== itemToDelete.id));
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers - 1
        }));
      } else {
        setStories(stories.filter(story => story.id !== itemToDelete.id));
        setStats(prev => ({
          ...prev,
          activeStories: stories.filter(s => s.status === 'published' && s.id !== itemToDelete.id).length,
          flaggedContent: stories.filter(s => s.status === 'flagged' && s.id !== itemToDelete.id).length
        }));
      }
      
      toast({
        title: 'Success',
        description: `${itemToDelete.type === 'user' ? 'User' : 'Story'} has been deleted.`,
      });
      
    } catch (error) {
      console.error('Failed to delete:', error);
      toast({
        title: 'Error',
        description: `Failed to delete ${itemToDelete.type}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      // Close the modal and reset state
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setIsDeleting(false);
    }
  };
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
    setSearchQuery(''); // Clear search when changing tabs
  };
  
  // Handle report actions
  const handleReportAction = async (reportId: string, action: 'dismiss' | 'review') => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: action === 'dismiss' ? 'dismissed' : 'reviewed' }
          : report
      ));
      
      toast({
        title: 'Success',
        description: `Report has been ${action === 'dismiss' ? 'dismissed' : 'marked as reviewed'}.`,
      });
      
    } catch (error) {
      console.error('Failed to update report:', error);
      toast({
        title: 'Error',
        description: 'Failed to update report. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Helper function to show toast notifications
  const { toast } = useToast();

  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string>('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // State for data management
  const [users, setUsers] = useState<User[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  
  // Derived state for recent items with proper type annotations
  const recentUsers: User[] = users.slice(0, 5);
  const recentStories: Story[] = stories.slice(0, 5);
  const editorPicks: Story[] = stories
    .filter((story: Story) => story.status === 'published')
    .slice(0, 3);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStories: 0,
    flaggedContent: 0,
    newReports: 0,
  });

  // State for UI
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch data on component mount and when active tab changes
  useEffect(() => {
    // Move the check inside the effect to avoid using isAuthenticated before declaration
    const checkAuth = async () => {
      const token = localStorage.getItem('isAuthenticated');
      if (token) {
        setIsAuthenticated(true);
        await fetchDashboardData();
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [activeTab]);

  // Simulate data fetching with loading state
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // In a real app, these would be API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample data - replace with actual API calls
      const mockUsers: User[] = [
        { id: "u1", username: "johndoe", email: "john@example.com", status: "active", role: "reader", joinDate: "2023-05-15" },
        { id: "u2", username: "janedoe", email: "jane@example.com", status: "active", role: "author", joinDate: "2023-05-10" },
        { id: "u3", username: "spam_bot", email: "spam@example.com", status: "banned", role: "reader", joinDate: "2023-05-20" },
      ];

      const mockStories: Story[] = [
        { id: "s1", title: "The Last Sunset", author: "John Smith", status: "published", views: 1245, likes: 89, publishDate: "2023-05-20" },
        { id: "s2", title: "Midnight Whispers", author: "Emma Wilson", status: "draft", views: 0, likes: 0, publishDate: "" },
        { id: "s3", title: "The Hidden Truth", author: "Alex Johnson", status: "flagged", views: 450, likes: 23, publishDate: "2023-05-18" },
      ];

      const mockReports: Report[] = [
        { id: "r1", storyId: "s3", storyTitle: "The Hidden Truth", reason: "Inappropriate content", reportedBy: "user123", status: "pending", reportedAt: "2023-05-21" },
        { id: "r2", storyId: "s1", storyTitle: "The Last Sunset", reason: "Copyright violation", reportedBy: "author456", status: "pending", reportedAt: "2023-05-22" },
      ];

      setUsers(mockUsers);
      setStories(mockStories);
      setReports(mockReports);
      
      // Update stats
      setStats({
        totalUsers: mockUsers.length,
        activeStories: mockStories.filter(s => s.status === 'published').length,
        flaggedContent: mockStories.filter(s => s.status === 'flagged').length,
        newReports: mockReports.filter(r => r.status === 'pending').length,
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = loginForm;
    
    // Simple validation (replace with actual authentication)
    if (email === 'admin@example.com' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      await fetchDashboardData();
      setLoginError('');
    } else {
      setLoginError('Invalid email or password');
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // Redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };



  // Handle input changes for login form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {loginError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive dark:text-destructive-foreground p-3 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline"
                    onClick={() => {
                      setLoginForm({
                        email: 'admin@example.com',
                        password: 'admin123' // Demo only - remove in production
                      });
                    }}
                  >
                    Use demo credentials
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                disabled={!loginForm.email || !loginForm.password}
              >
                Sign In
              </Button>
            </CardContent>
          </form>
          <CardFooter className="px-6 pb-6 pt-0">
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-serif font-bold text-foreground">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {showStoryEditor && (
          <StoryEditor 
            onClose={handleEditorClose}
            story={selectedStory ? {
              title: selectedStory.title,
              content: `By ${selectedStory.author}\n\n[Content for ${selectedStory.title} would be loaded here]`,
              status: selectedStory.status
            } : undefined}
            onSave={(storyData) => {
              console.log('Story saved:', storyData);
              // In a real app, you would update the state or make an API call
              toast({
                title: 'Success',
                description: `Story "${storyData.title}" has been saved.`,
              });
              handleEditorClose();
            }}
          />
        )}
        {!showStoryEditor && !showUserModal && !showDeleteConfirm && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your platform's content and users</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleNewStoryClick}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                New Story
              </Button>
            </div>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="space-y-6"
            defaultValue="overview"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                <span>Stories</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FlagIcon className="h-4 w-4" />
                <span>Reports</span>
                {reports.filter(r => r.status === 'pending').length > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center">
                    {reports.filter(r => r.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <StarIcon className="h-4 w-4" />
                <span>Featured</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="h-full">
                  <CardHeader className="pb-2 px-4 sm:px-6 py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Total Users</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4">
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card className="h-full">
                  <CardHeader className="pb-2 px-4 sm:px-6 py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Active Stories</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4">
                    <div className="text-2xl font-bold">{stats.activeStories}</div>
                    <p className="text-xs text-muted-foreground">+12 from last week</p>
                  </CardContent>
                </Card>
                <Card className="h-full">
                  <CardHeader className="pb-2 px-4 sm:px-6 py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FlagIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Flagged Content</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4">
                    <div className="text-2xl font-bold">{stats.flaggedContent}</div>
                    <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                  </CardContent>
                </Card>
                <Card className="h-full">
                  <CardHeader className="pb-2 px-4 sm:px-6 py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
                      <span>New Reports</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4">
                    <div className="text-2xl font-bold">{stats.newReports}</div>
                    <p className="text-xs text-muted-foreground">Needs review</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader className="px-4 sm:px-6 py-4">
                    <CardTitle className="text-lg">Recent Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="pl-4 sm:pl-6">User</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Role</TableHead>
                            <TableHead className="pr-4 sm:pr-6 text-right">Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentUsers.map((user) => (
                            <TableRow key={user.id} className="group">
                              <TableCell className="py-3 pl-4 sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full bg-muted flex-shrink-0 flex items-center justify-center font-medium text-foreground">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-medium truncate">{user.username}</div>
                                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell py-3">
                                <Badge 
                                  variant={
                                    user.status === 'active' ? 'default' : 
                                    user.status === 'suspended' ? 'outline' : 'destructive'
                                  }
                                  className="whitespace-nowrap"
                                >
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell py-3">
                                <Badge 
                                  variant="outline" 
                                  className={`whitespace-nowrap ${
                                    user.role === 'admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' :
                                    user.role === 'author' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                                    'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                  }`}
                                >
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 pr-4 sm:pr-6 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-sm font-medium">
                                    {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(user.joinDate).getFullYear()}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Stories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="hidden sm:table-cell">Title</TableHead>
                            <TableHead className="hidden md:table-cell">Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentStories.map((story) => (
                            <TableRow key={story.id} className="group">
                              <TableCell className="font-medium py-3 sm:py-4">
                                <div className="flex flex-col">
                                  <span className="font-medium">{story.title}</span>
                                  <span className="text-sm text-muted-foreground md:hidden">By {story.author}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell py-3 sm:py-4">
                                {story.author}
                              </TableCell>
                              <TableCell className="py-3 sm:py-4">
                                <Badge 
                                  variant={
                                    story.status === 'published' ? 'default' : 
                                    story.status === 'draft' ? 'outline' :
                                    story.status === 'flagged' ? 'destructive' : 'secondary'
                                  }
                                  className="whitespace-nowrap"
                                >
                                  {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 sm:py-4 text-right">
                                <div className="flex justify-end space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                    title="Edit"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                      <path d="m13.5 6.5 4 4"/>
                                    </svg>
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                    title="Delete"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                                      <path d="M3 6h18"/>
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                      <line x1="10" x2="10" y1="11" y2="17"/>
                                      <line x1="14" x2="14" y1="11" y2="17"/>
                                    </svg>
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.status === 'banned' ? 'destructive' : 'outline'} className="ml-auto">
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stories Tab */}
            <TabsContent value="stories" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Stories</CardTitle>
                      <CardDescription>Manage all stories on the platform</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BookOpenIcon className="mr-2 h-4 w-4" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Publish Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentStories.map((story) => (
                        <TableRow key={story.id}>
                          <TableCell className="font-medium">{story.title}</TableCell>
                          <TableCell>{story.author}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={story.status === 'published' ? 'default' : 
                                       story.status === 'draft' ? 'outline' : 'destructive'}
                              className="text-xs"
                            >
                              {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{story.publishDate || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Users</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <UsersIcon className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content Reports</CardTitle>
                      <CardDescription>Review and take action on reported content</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <FlagIcon className="mr-2 h-4 w-4" />
                      View All Reports
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reported Story</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.storyTitle}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={report.status === 'pending' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Featured Tab */}
            <TabsContent value="featured" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Editor's Picks</CardTitle>
                      <CardDescription>Manage featured stories on the platform</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <StarIcon className="mr-2 h-4 w-4" />
                      Add Featured Story
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editorPicks.map((pick) => (
                        <TableRow key={pick.id}>
                          <TableCell className="font-medium">{pick.title}</TableCell>
                          <TableCell>{pick.author}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={pick.status === 'published' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {pick.status.charAt(0).toUpperCase() + pick.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {pick.status === 'draft' && (
                              <>
                                <Button variant="ghost" size="sm" className="h-8 px-2 mr-2">
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                                  Reject
                                </Button>
                              </>
                            )}
                            {pick.status === 'published' && (
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                                Unpublish
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">General</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Site Title</p>
                          <p className="text-sm text-muted-foreground">The name of your site</p>
                        </div>
                        <div className="w-64">
                          <input 
                            type="text" 
                            defaultValue="Sunega Novel" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Site Description</p>
                          <p className="text-sm text-muted-foreground">A brief description of your site</p>
                        </div>
                        <div className="w-64">
                          <input 
                            type="text" 
                            defaultValue="A platform for sharing and reading stories" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Content Moderation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Require Email Verification</p>
                          <p className="text-sm text-muted-foreground">Users must verify their email to post content</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="sr-only">Toggle email verification</span>
                            <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Moderate New Stories</p>
                          <p className="text-sm text-muted-foreground">Review stories before they're published</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="sr-only">Toggle story moderation</span>
                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">User Details</h3>
                  <button 
                    onClick={closeUserModal}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-medium">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedUser.username}</h4>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{selectedUser.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{selectedUser.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={closeUserModal}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        closeUserModal();
                        confirmDelete('user', selectedUser.id);
                      }}
                    >
                      Delete User
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <path d="M12 9v4"/>
                      <path d="M12 17h.01"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                </div>
                
                <p className="text-muted-foreground">
                  Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
                </p>
                
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
