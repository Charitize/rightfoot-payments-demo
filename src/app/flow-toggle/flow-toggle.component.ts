import { Component, Input, OnDestroy } from '@angular/core';
import { FlowService } from '../flow.service';
import { map, take } from 'rxjs/operators';
import { Flow } from '../shared/flow.enum';
import { Observable, Subscription } from 'rxjs';

/**
 * Simple toggle component which switches between two flows:
 * Dynamic funding sources and Monolithic funding source
 * using {@link FlowService}.
 */
@Component({
  selector: 'app-flow-toggle',
  templateUrl: './flow-toggle.component.html'
})
export class FlowToggleComponent implements OnDestroy {
  private subscription: Subscription;

  /** Exposing this value for the mat-slide-toggle checked property. */
  public isChecked$: Observable<boolean> = this.flowService.activeFlow$.pipe(
    map(flow => flow === Flow.DYNAMIC)
  );

  /** Disables underlying input. */
  @Input()
  public disabled = false;

  constructor(private flowService: FlowService) {
  }

  public toggleFlow(): void {
    this.subscription = this.flowService.activeFlow$
      .pipe(take(1))
      .subscribe(activeFlow => {
        const flow = activeFlow === Flow.MONOLITHIC ? Flow.DYNAMIC : Flow.MONOLITHIC;
        this.flowService.setActiveFlow(flow);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
