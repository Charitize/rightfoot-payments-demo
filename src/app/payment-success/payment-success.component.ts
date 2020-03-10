import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';
import { Payment } from '../shared/payment.interface';
import { StorageService } from '../storage.service';
import { switchMap } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription: Subscription;
  public payment: Payment;
  public loading = false;
  public error: any;
  @ViewChild('expansionPanel', { static: true })
  expansionPanel!: MatExpansionPanel;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.checkPayment();
  }

  ngAfterViewInit() {
    if (this.expansionPanel === null || this.expansionPanel === undefined) {
      throw new Error('Expansion panel must be present');
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public checkPayment(expandPanel = false): void {
    if (this.loading) {
      return;
    }
    if (expandPanel) {
      this.expansionPanel.open();
    }
    this.loading = true;
    this.subscription = StorageService.storedPaymentUuid$.pipe(
      switchMap(uuid => this.apiService.getPayment(uuid))
    ).subscribe(payment => {
      this.payment = payment;
      this.loading = false;
      this.error = null;
    }, (error) => {
      this.loading = false;
      this.error = error;
      this.payment = null;
    });
  }
}