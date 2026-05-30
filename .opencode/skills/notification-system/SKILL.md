---
name: notification-system
description: Use this skill when implementing in-app notifications, WhatsApp notifications, or push notification systems. Covers notification architecture, queue processing, and delivery tracking.
---

# Notification System Skill

## Notification Architecture

### Models
```prisma
model Notification {
  id          String           @id @default(uuid())
  userId      String
  type        NotificationType
  title       String
  message     String
  actionUrl   String?
  actionLabel String?
  metadata    Json?
  isRead      Boolean          @default(false)
  readAt      DateTime?
  expiresAt   DateTime?
  createdAt   DateTime         @default(now())
}

model WhatsAppNotification {
  id          String                     @id @default(uuid())
  userId      String
  type        WhatsAppNotificationType
  status      WhatsAppNotificationStatus @default(PENDING)
  phoneNumber String
  message     String                     @db.Text
  templateKey String
  priority    QueuePriority              @default(MEDIUM)
  retryCount  Int                        @default(0)
  createdAt   DateTime                   @default(now())
}
```

## In-App Notifications

### Creating Notifications
```typescript
async function createNotification(data: CreateNotificationInput) {
  const notification = await db.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      actionUrl: data.actionUrl,
      metadata: data.metadata,
      expiresAt: data.expiresAt,
    },
  });
  
  // Emit real-time update if user is online
  await pusher.trigger(`user-${data.userId}`, 'notification', notification);
  
  return notification;
}
```

### Notification Types
- `CASE_ASSIGNED` - New case assigned
- `PLAN_CREATED` - New plan created
- `PAYMENT_SUCCESS` - Payment completed
- `APPLICATION_STATUS` - Job application update
- `JOB_ALERT` - New matching job posting

### Fetching Notifications
```typescript
// tRPC router
getUnread: protectedProcedure
  .query(async ({ ctx }) => {
    return db.notification.findMany({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }),
```

## WhatsApp Notifications

### Queue-Based Processing
```typescript
// Add to queue
await db.whatsAppNotification.create({
  data: {
    userId,
    type: 'COURSE_COMPLETION',
    phoneNumber: user.phoneNumber,
    message: renderTemplate('course_completion', { courseName }),
    templateKey: 'course_completion',
    priority: 'HIGH',
  },
});

// Worker processing
async function processWhatsAppQueue() {
  const pending = await db.whatsAppNotification.findMany({
    where: { status: 'PENDING' },
    orderBy: [
      { priority: 'asc' },
      { createdAt: 'asc' },
    ],
    take: 10,
  });
  
  for (const notification of pending) {
    try {
      await sendWhatsAppMessage(notification);
      await db.whatsAppNotification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
    } catch (error) {
      await handleFailedNotification(notification, error);
    }
  }
}
```

### Retry Logic
```typescript
async function handleFailedNotification(
  notification: WhatsAppNotification,
  error: Error
) {
  const maxRetries = 3;
  
  if (notification.retryCount < maxRetries) {
    await db.whatsAppNotification.update({
      where: { id: notification.id },
      data: {
        status: 'PENDING',
        retryCount: { increment: 1 },
        error: error.message,
      },
    });
  } else {
    await db.whatsAppNotification.update({
      where: { id: notification.id },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        error: error.message,
      },
    });
  }
}
```

## Real-Time Updates

### Pusher Integration
```typescript
// Send notification
await pusher.trigger(
  `private-user-${userId}`,
  'new-notification',
  {
    id: notification.id,
    title: notification.title,
    message: notification.message,
  }
);

// Client subscription
useEffect(() => {
  const channel = pusher.subscribe(`private-user-${userId}`);
  channel.bind('new-notification', (data) => {
    addNotification(data);
  });
  
  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`private-user-${userId}`);
  };
}, [userId]);
```

## Notification UI

### Toast Notifications
```tsx
import { toast } from 'sonner';

// Success toast
toast.success('Course enrolled successfully', {
  action: {
    label: 'View Course',
    onClick: () => router.push(`/courses/${courseId}`),
  },
});

// Error toast
toast.error('Payment failed', {
  description: 'Please try again or contact support',
});
```

### Notification Bell Component
```tsx
export default function NotificationBell() {
  const { data: notifications } = api.notification.getUnread.useQuery();
  const unreadCount = notifications?.length ?? 0;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications?.map(n => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Best Practices
- [ ] Queue-based processing for reliability
- [ ] Retry logic with exponential backoff
- [ ] Idempotency for duplicate prevention
- [ ] Priority-based processing
- [ ] Delivery tracking and monitoring
- [ ] User preferences for notification types
- [ ] Rate limiting to prevent spam
- [ ] Expiration for time-sensitive notifications
