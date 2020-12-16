import { Component } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent {
  statusResponse: string;


  constructor(private storageService: StorageService) {
    this.statusResponse = JSON.stringify(JSON.parse(this.storageService.getStoredPlaidResponse()), null, 2);
  }

  checkStatus() {
    this.statusResponse = JSON.stringify(JSON.parse(this.storageService.getStoredPlaidResponse()), null, 2);
  }
}
