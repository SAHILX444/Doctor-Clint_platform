import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { NotificationItem } from '../../components/queue/NotificationItem'
import { useQueue } from '../../context/QueueProvider'
export function NotificationsPage() {
  const { notifications, tick, readNotifications } = useQueue()
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some((n) => n.unread) && (
          <button className="text-xs font-semibold text-brand" onClick={readNotifications}>
            Mark all read
          </button>
        )}
      </div>
      <Card className="p-5">
        {notifications.length ? (
          notifications.map((item) => <NotificationItem key={item.id} item={item} now={tick} />)
        ) : (
          <EmptyState title="You're all caught up" message="New queue updates will appear here." />
        )}
      </Card>
    </div>
  )
}
