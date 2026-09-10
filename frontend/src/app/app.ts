import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  readonly isNavigating = signal(false);
  readonly transitionKey = signal(0);
  private readonly subscription: Subscription;

  constructor(router: Router) {
    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
        return;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isNavigating.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRouteActivate(): void {
    this.transitionKey.update(value => value + 1);
  }
}
