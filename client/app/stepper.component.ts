import { Component, OnDestroy } from '@angular/core';
import { StorageService } from './storage.service';
import { Subscription } from 'rxjs';
import { DemoProgress } from './demo-progress';

/**
 * Stepper status
 */
enum StepStatusStyle {
  ACTIVE = 'active',
  PENDING = 'pending',
  DONE = 'done',
}

/**
 * This component provides a styled stepper for the application.
 * Showing current step.
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnDestroy {
  private readonly subscription: Subscription;

  stepOneStyle = StepStatusStyle.ACTIVE;
  stepTwoStyle = StepStatusStyle.PENDING;
  stepThreeStyle = StepStatusStyle.PENDING;

  stepOneLineStyle = StepStatusStyle.PENDING;
  stepTwoLineStyle = StepStatusStyle.PENDING;

  stepOneDone = false;
  stepTwoDone = false;
  stepThreeDone = false;

  constructor(private storageService: StorageService) {
    this.subscription = storageService.currentStep$.subscribe(
      (currentStep) => {
        this.handleStyle(currentStep);
      }
    );
  }

  private handleStyle(currentStep: number): void {
    this.stepOneStyle =
      currentStep === DemoProgress.CREATE_BENEFICIARY ? StepStatusStyle.ACTIVE : StepStatusStyle.DONE;
    this.stepTwoStyle =
      currentStep === DemoProgress.LINK_LOAN
        ? StepStatusStyle.ACTIVE
        : currentStep > DemoProgress.LINK_LOAN
        ? StepStatusStyle.DONE
        : StepStatusStyle.PENDING;
    this.stepThreeStyle =
      currentStep === DemoProgress.CREATE_PAYMENT
        ? StepStatusStyle.ACTIVE
        : currentStep > DemoProgress.CREATE_PAYMENT
        ? StepStatusStyle.DONE
        : StepStatusStyle.PENDING;

    this.stepOneLineStyle =
      currentStep > DemoProgress.CREATE_BENEFICIARY
        ? StepStatusStyle.DONE
        : StepStatusStyle.PENDING;
    this.stepTwoLineStyle =
      currentStep > DemoProgress.LINK_LOAN
        ? StepStatusStyle.DONE
        : StepStatusStyle.PENDING;

    this.stepOneDone = currentStep > DemoProgress.CREATE_BENEFICIARY;
    this.stepTwoDone = currentStep > DemoProgress.LINK_LOAN;
    this.stepThreeDone = currentStep > DemoProgress.CREATE_PAYMENT;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
