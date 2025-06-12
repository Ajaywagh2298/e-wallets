import { selectQuery, updateQuery } from './controller';
import { saveLogs } from './controller';
import { database } from '../config/config';
/**
 * Get current month reminders filtered by priority
 * @returns {Array} Filtered and sorted reminder data
 */
export const getCurrentMonthReminders = async () => {
  try {
    // Get all tasks with reminders enabled (don't filter by status here)
    const allTasks = await selectQuery('task');

    if (!allTasks || allTasks.length === 0) {
      return [];
    }

    // Filter tasks with reminder = 1 and not deleted
    const reminderTasks = allTasks.filter(task =>
      task.reminder === 1 &&
      task.status !== 'delete' &&
      task.status !== 'deleted'
    );
    
    if (reminderTasks.length === 0) {
      return [];
    }

    // Get current date info
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentDate = now.getDate();
    
    // Day names mapping
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[currentDay];

    // Filter tasks based on reminder type and current month
    const currentMonthReminders = reminderTasks.filter(task => {
      const { reminderType, reminderValue } = task;

      switch (reminderType) {
        case 'date':
          if (!reminderValue) return false;
          try {
            const reminderDate = new Date(reminderValue);
            return reminderDate.getMonth() === currentMonth && 
                   reminderDate.getFullYear() === currentYear;
          } catch (error) {
             // console.error('Invalid date format:', reminderValue);
            return false;
          }

        case 'week':
        case 'day':
          // Show if reminder day matches current day
          return reminderValue === currentDayName;

        case 'daily':
          // Show all daily reminders
          return true;

        case 'monthly':
          // Show all monthly reminders in current month
          return true;

        default:
          return false;
      }
    });

    // Priority order mapping
    const priorityOrder = {
      'High': 1,
      'Medium': 2,
      'Low': 3
    };

    // Sort by priority (High -> Medium -> Low) then by created date
    const sortedReminders = currentMonthReminders.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 4;
      const priorityB = priorityOrder[b.priority] || 4;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by created date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return sortedReminders;
  } catch (error) {
     // console.error('Error fetching current month reminders:', error);
    return [];
  }
};

/**
 * Get reminder statistics for dashboard
 * @returns {Object} Reminder statistics
 */
export const getReminderStats = async () => {
  try {
    const reminders = await getCurrentMonthReminders();
    
    const stats = {
      total: reminders.length,
      high: reminders.filter(r => r.priority == 'High').length,
      medium: reminders.filter(r => r.priority == 'Medium').length,
      low: reminders.filter(r => r.priority == 'Low').length,
      pending: reminders.filter(r => r.status == 'Pending').length,
      completed: reminders.filter(r => r.status == 'Completed').length,
    };

    return stats;
  } catch (error) {
     // console.error('Error getting reminder stats:', error);
    return {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
      pending: 0,
      completed: 0
    };
  }
};

/**
 * Format reminder for display
 * @param {Object} reminder - Reminder object
 * @returns {Object} Formatted reminder
 */
export const formatReminderForDisplay = (reminder) => {
  const { reminderType, reminderValue, priority, taskName, description } = reminder;
  
  let displayText = '';
  let urgencyLevel = '';
  
  // Format reminder display text
  switch (reminderType) {
    case 'date':
      if (reminderValue) {
        const date = new Date(reminderValue);
        displayText = `Due: ${date.toLocaleDateString('en-IN')}`;
      }
      break;
    case 'week':
    case 'day':
      displayText = `Every ${reminderValue}`;
      break;
    case 'daily':
      displayText = 'Daily reminder';
      break;
    case 'monthly':
      displayText = 'Monthly reminder';
      break;
    default:
      displayText = 'Reminder set';
  }

  // Set urgency level
  switch (priority) {
    case 'High':
      urgencyLevel = 'urgent';
      break;
    case 'Medium':
      urgencyLevel = 'moderate';
      break;
    case 'Low':
      urgencyLevel = 'low';
      break;
    default:
      urgencyLevel = 'normal';
  }

  return {
    ...reminder,
    displayText,
    urgencyLevel,
    shortDescription: description.length > 50 ? description.substring(0, 50) + '...' : description
  };
};

/**
 * Get today's specific reminders
 * @returns {Array} Today's reminders
 */
export const getTodayReminders = async () => {
  try {
    const allReminders = await getCurrentMonthReminders();
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];

    const todayReminders = allReminders.filter(reminder => {
      const { reminderType, reminderValue } = reminder;

      switch (reminderType) {
        case 'date':
          return reminderValue === today;
        case 'week':
        case 'day':
          return reminderValue === currentDayName;
        case 'daily':
          return true;
        default:
          return false;
      }
    });

    return todayReminders.map(formatReminderForDisplay);
  } catch (error) {
     // console.error('Error getting today reminders:', error);
    return [];
  }
};

/**
 * Mark reminder as completed
 * @param {number} uid - Task UID
 * @returns {boolean} Success status
 */
export const completeReminder = async (uid) => {
  try {
    const sql = `UPDATE task SET status = 'COMPLETED' WHERE uid = ?;`;
    let result = await database.runAsync(sql, [uid]);
    return result;
  } catch (error) {
     // console.error('Error completing reminder:', error);
    return false;
  }
};

/**
 * Delete reminder (set status to delete and reminder to 0)
 * @param {number} uid - Task UID
 * @returns {boolean} Success status
 */
export const deleteReminder = async (uid) => {
  try {

    const sql = `UPDATE task SET status = 'DELETE', reminder = 0 WHERE uid = ?;`;
    let result = await database.runAsync(sql, [uid]);
    return result;
  } catch (error) {
    return false;
  }
};

