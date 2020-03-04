import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLoansComponent } from './pay-loans.component';

describe('PayLoansComponent', () => {
  let component: PayLoansComponent;
  let fixture: ComponentFixture<PayLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
