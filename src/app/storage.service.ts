import { Beneficiary } from './shared/beneficiary.interface';

/**
 * This static service is used to store required data for requests.
 */
export class StorageService {
  private static USER_ID_KEY = 'b_uuid';
  private static storage = window.sessionStorage;

  /**
   * Returns cached user id.
   */
  public static getStoredUserId(): string {
    return this.storage.getItem(this.USER_ID_KEY);
  }

  /**
   * Stores user's id in the session storage.
   * @param beneficiary user to store id for.
   */
  public static storeUserId(beneficiary: Beneficiary): void {
    this.storage.setItem(this.USER_ID_KEY, beneficiary.uuid);
  }
}
