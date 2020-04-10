import { Injectable } from '@angular/core';
import { NgxPlaidLinkService } from 'ngx-plaid-link';
import { PlaidConfig, PlaidOnSuccessArgs, PlaidSuccessMetadata } from 'ngx-plaid-link/lib/interfaces';
import { PlaidLinkHandler } from 'ngx-plaid-link/lib/ngx-plaid-link-handler';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';


/**
 * This config uses accountTypes field which is needed for filtering
 * student loans from plaid. We need to use our own interface
 * because ngx-plaid-link's interface currently does not support this.
 */
interface UpdatedPlaidConfig extends PlaidConfig {
  accountTypes?: {
    loan?: Array<'student'>
  };
}

type PlaidConfigWithoutListeners = Omit<UpdatedPlaidConfig, 'onSuccess' | 'onExit'>;

/**
 * Provides abstraction around Plaid Link and creating loans based on it.
 */
@Injectable({
  providedIn: 'root'
})
export class PlaidService {
  constructor(private plaidLinkService: NgxPlaidLinkService,
              private storageService: StorageService) {
  }

  private config: PlaidConfigWithoutListeners = {
    clientName: 'Rightfoot',
    env: environment.plaid.environment,
    key: environment.plaid.publicKey,
    product: ['liabilities'],
    countryCodes: ['US'],
    accountTypes: {
      loan: ['student']
    }
  };

  private authConfig: PlaidConfigWithoutListeners = {
    clientName: 'Rightfoot',
    env: environment.plaid.environment,
    key: environment.plaid.publicKey,
    product: ['auth']
  };

  private handlePlaidLink(config: PlaidConfigWithoutListeners): Observable<PlaidOnSuccessArgs> {
    return new Observable<PlaidOnSuccessArgs>(
      (observer: Subscriber<PlaidOnSuccessArgs>) => {
        this.plaidLinkService.createPlaid({
          ...config,
          onSuccess: (token: string, metadata: PlaidSuccessMetadata) => {
            observer.next({ token, metadata });
            observer.complete();
          },
          onExit: () => observer.complete(),
        }).then((handler: PlaidLinkHandler) => {
          handler.open();
        });
      });

  }

  /**
   * Launches Plaid Link.
   */
  public addPlaidLoan(): Observable<PlaidOnSuccessArgs> {
    return this.handlePlaidLink(this.config).pipe(
      map(plaidLinkResponse => {
        this.storageService.storePlaidToken(plaidLinkResponse.token);
        return plaidLinkResponse;
      })
    );
  }

  public getFundingSource(): Observable<PlaidOnSuccessArgs> {
    return this.handlePlaidLink(this.authConfig);
  }
}
