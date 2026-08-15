import React from 'react';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, HeartHandshake } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import { useNotifications } from '../../context/NotificationContext';
import StatusBadge from '../../components/StatusBadge';

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'MATCH':
      case 'ALLOCATION': return <HeartHandshake className="w-5 h-5 text-sky-500" />;
      default: return <Info className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-10rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Notifications Center</h1>
                  <p className="text-xs text-slate-500">Live alerts regarding donation pledges, waiting rank updates, and organ allocations</p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark All as Read</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-sm font-medium">No notifications in your inbox.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`py-4 px-4 rounded-xl transition-colors cursor-pointer flex items-start space-x-4 ${
                      !n.is_read ? 'bg-sky-50/50 hover:bg-sky-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.is_read && (
                      <span className="w-2.5 h-2.5 bg-sky-500 rounded-full flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
