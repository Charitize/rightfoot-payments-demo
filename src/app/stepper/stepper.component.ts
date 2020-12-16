import { Component } from '@angular/core';
import { StorageService } from '../storage.service';

enum StepStatusStyle {
  ACTIVE = 'active',
  PENDING = 'pending',
  DONE = 'done'
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  stepOneStyle = StepStatusStyle.ACTIVE;
  stepTwoStyle = StepStatusStyle.PENDING;
  stepThreeStyle = StepStatusStyle.PENDING;

  stepOneLineStyle = StepStatusStyle.PENDING;
  stepTwoLineStyle = StepStatusStyle.PENDING;

  stepOneDone = false;
  stepTwoDone = false;
  stepThreeDone = false;

  constructor(private storageService: StorageService) {
    storageService.storeCurrentStep(1);
    storageService.storedCurrentStep$.subscribe(currentStep => {
      this.handleStyle(currentStep);
    });
  }

  private handleStyle(currentStep: number): void {
    currentStep = currentStep === 0 ? 1 : currentStep;
    this.stepOneStyle = currentStep === 1 ? StepStatusStyle.ACTIVE : StepStatusStyle.DONE;
    this.stepTwoStyle = currentStep === 2
      ? StepStatusStyle.ACTIVE
      : currentStep > 2
        ? StepStatusStyle.DONE
        : StepStatusStyle.PENDING;
    this.stepThreeStyle = currentStep === 3
      ? StepStatusStyle.ACTIVE
      : currentStep > 3
        ? StepStatusStyle.DONE
        : StepStatusStyle.PENDING;

    this.stepOneLineStyle = currentStep > 1 ? StepStatusStyle.DONE : StepStatusStyle.PENDING;
    this.stepTwoLineStyle = currentStep > 2 ? StepStatusStyle.DONE : StepStatusStyle.PENDING;

    this.stepOneDone = currentStep > 1;
    this.stepTwoDone = currentStep > 2;
    this.stepThreeDone = currentStep > 3;
  }
}
