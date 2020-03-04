import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

/**
 * This component provides a form with a payment amount input and a "Pay" button,
 * which will trigger demographics info collection, if it is not provided yet,
 * or initialize payment request.
 */
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: [ './payment-form.component.scss' ]
})
export class PaymentFormComponent {
  /**
   * Form definition with validators.
   */
  public form: FormGroup = new FormGroup({
    amount: new FormControl('', [ Validators.required ])
  });

  /**
   * Form submit handler.
   */
  public onSubmit() {
    // TODO(RF-350) create a real handler here.
  }
}
