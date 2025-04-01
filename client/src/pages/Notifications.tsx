import Header from "@/components/Header";
import { useState } from "react";

// Mock notification data type
interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'update' | 'playlist';
}

export default function Notifications() {
  // In a real app, these would come from an API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Playlist Feature",
      message: "You can now create and manage your own playlists! Try it now.",
      timestamp: "1 hour ago",
      isRead: false,
      type: 'update'
    },
    {
      id: 2,
      title: "Welcome to Melodify",
      message: "Thanks for joining! Start exploring music and creating playlists.",
      timestamp: "2 days ago",
      isRead: true,
      type: 'info'
    }
  ]);
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <div>
      <Header />
      
      <div className="px-6 py-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`bg-background-card rounded-lg p-4 border-l-4 ${
                  notification.isRead ? 'border-accent/50' : 'border-primary'
                } transition-all hover:bg-background-card/80`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {notification.type === 'info' && <i className="ri-information-line text-blue-400 text-xl"></i>}
                    {notification.type === 'update' && <i className="ri-upload-2-line text-green-400 text-xl"></i>}
                    {notification.type === 'playlist' && <i className="ri-music-2-line text-purple-400 text-xl"></i>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-text-secondary">{notification.timestamp}</span>
                    </div>
                    <p className="text-text-secondary text-sm">{notification.message}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary ml-2 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-background-card rounded-lg p-8 text-center">
            <i className="ri-notification-3-line text-5xl text-text-secondary mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-text-secondary">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
