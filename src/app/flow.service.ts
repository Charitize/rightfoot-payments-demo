import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flow } from './shared/flow.enum';

/**
 * Provides simple functionality to change demo application flow.
 * Allows switching between different app behaviors such as using
 * Rightfoot's monolithic funding source or to allow adding funding
 * sources dynamically.
 * @link Flow
 */
@Injectable({
  providedIn: 'root'
})
export class FlowService {
  private activeFlowSubject: BehaviorSubject<Flow> = new BehaviorSubject<Flow>(Flow.MONOLITHIC);

  /**
   * Stream with a currently active app flow.
   */
  public activeFlow$ = this.activeFlowSubject.asObservable();

  /**
   * Updates active flow for the application.
   */
  public setActiveFlow(flow: Flow): void {
    this.activeFlowSubject.next(flow);
  }
}
