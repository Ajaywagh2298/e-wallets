import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { selectQuery } from './controller'; 

const TASK_NAME = 'reminder-background-task';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log("[Reminder] Background task running...");
    await scheduleRemindersWithTime();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[Reminder] Task Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerReminderTask() {
  try {
    const isTaskDefined = TaskManager.isTaskDefined(TASK_NAME);
    const status = await BackgroundFetch.getStatusAsync();

    if (isTaskDefined && status !== BackgroundFetch.BackgroundFetchStatus.Restricted) {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 3600, // Every 1 hour
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('[Reminder] Background task registered.');
    }
  } catch (error) {
    console.error('[Reminder] Register Error:', error);
  }
}

export const scheduleRemindersWithTime = async () => {
  try {
    const allTasks = await selectQuery('task');
    const now = new Date();

    const reminderTasks = allTasks.filter(task =>
      task.reminder === 1 &&
      task.status !== 'delete' &&
      task.status !== 'deleted'
    );

    const today = new Date();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];

    for (const task of reminderTasks) {
      const { reminderType, reminderValue, reminderTime } = task;
      const [hourStr, minStr] = (reminderTime || '').split(":");
      const hour = parseInt(hourStr);
      const minute = parseInt(minStr);
      if (isNaN(hour) || isNaN(minute)) continue;

      const triggerDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);
      if (triggerDate <= now) continue;

      let shouldSchedule = false;

      switch (reminderType) {
        case 'date': {
          const date = new Date(reminderValue);
          shouldSchedule = (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );
          break;
        }
        case 'week':
        case 'day':
          shouldSchedule = reminderValue === dayName;
          break;
        case 'daily':
          shouldSchedule = true;
          break;
        case 'monthly':
          shouldSchedule = today.getDate() === 1 || today.getDate() === 15 || today.getDate() === 28;
          break;
        default:
          shouldSchedule = false;
      }
      const formatNotificationContent = (task) => {
        return {
          title: `🔔 ${task.reminderCategory || 'Reminder'}: ${task.title}`,
          body: `📝 ${task.description || 'No description'}\n🎯 Priority: ${task.priority || 'Normal'}`,
          data: {
            category: task.reminderCategory,
            priority: task.priority
          }
        };
      };
      
      // Usage
      await Notifications.scheduleNotificationAsync({
        content: formatNotificationContent(task),
        trigger: triggerDate
      });
      
      if (shouldSchedule) {
        await Notifications.scheduleNotificationAsync({
          content: formatNotificationContent(task),
          trigger: triggerDate
        });
      }
    }
  } catch (error) {
    console.error('[Reminder] Scheduling Error:', error);
  }
};
