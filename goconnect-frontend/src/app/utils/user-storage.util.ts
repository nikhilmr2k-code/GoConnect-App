/**
 * Utility functions for working with user data in localStorage
 */

export class UserStorageUtil {
  
  /**
   * Get the current logged-in user ID from localStorage
   * @returns The user ID as a number, or null if not found
   */
  static getCurrentUserId(): number | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  }

  /**
   * Get the current logged-in user data from localStorage
   * @returns The user object, or null if not found
   */
  static getCurrentUser(): any | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Check if a user is currently logged in
   * @returns True if user is logged in, false otherwise
   */
  static isUserLoggedIn(): boolean {
    return this.getCurrentUserId() !== null;
  }

  /**
   * Get a specific user property from localStorage
   * @param property The property name to retrieve
   * @returns The property value, or null if not found
   */
  static getUserProperty(property: string): any | null {
    const user = this.getCurrentUser();
    return user && user[property] ? user[property] : null;
  }

  /**
   * Clear all user data from localStorage
   */
  static clearUserData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userId');
    }
  }
}