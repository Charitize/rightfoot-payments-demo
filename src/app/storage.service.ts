import { Beneficiary } from './shared/beneficiary.interface';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * This static service is used to store required data for requests.
 * It roughly emulates this application's API backend server where useful data about
 * objects we create through Rightfoot Public API is stored.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private static readonly USER_ID_KEY = 'b_uuid';
  private static readonly PLAID_TOKEN_KEY = 'pl_t';
  private static readonly PAYMENTS_ENABLED_KEY = 'p_e';
  private static readonly PAYMENT_UUID_KEY = 'p_u';
  private static readonly PAYMENT_RESPONSE = 'p_resp';
  private static readonly CURRENT_STEP = 'current_step';

  private static readonly storage = window.sessionStorage;

  private storedPaymentUuidSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.getStoredPaymentUuid()
  );

  /**
   * Returns stream with a currently stored payment uuid.
   */
  public storedPaymentUuid$ = this.storedPaymentUuidSubject.asObservable();

  private storedCurrentStepSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.getStoredCurrentStep()
  );

  /**
   * Returns stream with a currently stored current step.
   */
  public storedCurrentStep$ = this.storedCurrentStepSubject.asObservable();

  /**
   * Returns cached user id.
   */
  public getStoredUserId(): string {
    return StorageService.storage.getItem(StorageService.USER_ID_KEY);
  }

  /**
   * Caches user's id in the session storage.
   * @param beneficiary user to store id for.
   */
  public storeUserId(beneficiary: Beneficiary): void {
    StorageService.storage.setItem(
      StorageService.USER_ID_KEY,
      beneficiary.uuid
    );
  }

  /**
   * Caches token received from Plaid.
   * @param token Public token obtained from Plaid using Rightfoot's Plaid public key.
   */
  public storePlaidToken(token: string): void {
    StorageService.storage.setItem(StorageService.PLAID_TOKEN_KEY, token);
  }

  /**
   * Returns cached plaid token.
   */
  public getStoredPlaidToken(): string {
    return StorageService.storage.getItem(StorageService.PLAID_TOKEN_KEY);
  }

  /**
   * Caches value which indicates if payments are enabled for this user.
   */
  public storePaymentsEnabled(paymentsEnabled: boolean): void {
    StorageService.storage.setItem(
      StorageService.PAYMENTS_ENABLED_KEY,
      JSON.stringify(paymentsEnabled)
    );
  }

  /**
   * Returns cached paymentsEnabled value
   * which indicates if payments are enabled for this user.
   */
  public getStoredPaymentsEnabled(): boolean | null {
    const value = StorageService.storage.getItem(
      StorageService.PAYMENTS_ENABLED_KEY
    );
    return value ? JSON.parse(value) : null;
  }

  /**
   * Caches created payment's UUID.
   * @param uuid Unique identifier generated by Rightfoot.
   */
  public storePaymentUuid(uuid: string): void {
    this.storedPaymentUuidSubject.next(uuid);
    StorageService.storage.setItem(StorageService.PAYMENT_UUID_KEY, uuid);
  }

  /**
   * Returns cached payment's UUID.
   */
  public getStoredPaymentUuid(): string {
    return StorageService.storage.getItem(StorageService.PAYMENT_UUID_KEY);
  }

  /**
   * Resets application state.
   */
  public clearAll(): void {
    StorageService.storage.clear();
  }

  /**
   * Store full response from Plaid.
   */
  public storeResponse(response: string): void {
    StorageService.storage.setItem(StorageService.PAYMENT_RESPONSE, response);
  }

  /**
   * Returns stored response.
   */
  public getStoredPlaidResponse(): string {
    return StorageService.storage.getItem(StorageService.PAYMENT_RESPONSE);
  }

  /**
   * Store current step.
   */
  public storeCurrentStep(currentStep: number): void {
    this.storedCurrentStepSubject.next(currentStep);
    StorageService.storage.setItem(
      StorageService.CURRENT_STEP,
      currentStep.toString()
    );
  }

  /**
   * Returns stored current step.
   */
  public getStoredCurrentStep(): number {
    return parseInt(StorageService.storage.getItem(StorageService.CURRENT_STEP), 10);
  }
}
