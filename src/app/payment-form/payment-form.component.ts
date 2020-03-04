import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: [ './payment-form.component.scss' ]
})
export class PaymentFormComponent {
  public form: FormGroup = new FormGroup({
    amount: new FormControl('', [ Validators.required ])
  });

  public onSubmit() {
    console.log('Success', this.form.get('amount').value);
  }
}
