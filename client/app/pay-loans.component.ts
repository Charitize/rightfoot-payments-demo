import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { DemoProgress } from './demo-progress';
import { Observable } from 'rxjs';

/**
 * This is a page container component for making loan payments
 * and collecting demographics information.
 */
@Component({
  selector: 'app-pay-loans',
  templateUrl: './pay-loans.component.html',
  styleUrls: ['./pay-loans.component.scss']
})
export class PayLoansComponent {
  constructor(private storageService: StorageService) {}

  public DemoProgress = DemoProgress;

  public currentStep$: Observable<DemoProgress> =
      this.storageService.currentStep$;
}
