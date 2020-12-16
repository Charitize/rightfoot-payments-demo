import { Component } from '@angular/core';
import { StorageService } from '../storage.service';

/**
 * This component provides a styled header for the application.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private storageService: StorageService) {
  }

  reset() {
    this.storageService.clearAll();
    window.location.reload();
  }
}
