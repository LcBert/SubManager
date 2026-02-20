// Utility to schedule notifications using Capacitor Local Notifications
import { LocalNotifications } from '@capacitor/local-notifications';

// Schedules notifications for a subscription
export async function scheduleSubscriptionNotifications(sub, subscriptionName) {
    if (!sub.notifications || !Array.isArray(sub.notifications)) return;

    // Request notification permissions
    const permResult = await LocalNotifications.requestPermissions();
    if (permResult.display !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    const now = new Date();
    const notificationsToSchedule = sub.notifications.map((notif, idx) => {
        // Calculate the target date/time for the notification
        // Assume sub.firstBill is the next payment date (ISO string)
        let paymentDate = new Date(sub.firstBill);
        let notifyDate = new Date(paymentDate);
        const number = parseInt(notif.number, 10) || 0;
        const timeParts = notif.time ? notif.time.split(':') : ['09', '00'];
        notifyDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0, 0);

        // Subtract period
        if (notif.period === 'day') {
            notifyDate.setDate(paymentDate.getDate() - number);
        } else if (notif.period === 'week') {
            notifyDate.setDate(paymentDate.getDate() - (number * 7));
        } else if (notif.period === 'month') {
            notifyDate.setMonth(paymentDate.getMonth() - number);
        }

        // If notifyDate is in the past, skip
        if (notifyDate <= now) return null;

        // Replace parameters in message
        let msg = notif.message || '';
        msg = msg.replace('$p', sub.amount || '')
            .replace('$t', `${number} ${notif.period}${number > 1 ? 's' : ''}`)
            .replace('$n', subscriptionName || sub.title || '');

        return {
            id: Math.floor(Math.random() * 1000000) + idx,
            title: subscriptionName || sub.title || '',
            body: msg,
            schedule: { at: notifyDate },
        };
    }).filter(Boolean);

    if (notificationsToSchedule.length > 0) {
        await LocalNotifications.schedule({ notifications: notificationsToSchedule });
    }
}
