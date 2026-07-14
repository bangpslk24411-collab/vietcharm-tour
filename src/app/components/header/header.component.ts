import { Component, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import type { ServiceTab } from '@/constants/views';
import { AuthService } from '@/services/auth.service';
import { CartService } from '@/services/cart.service';
import { I18nService } from '@/services/i18n.service';
import { UiStateService } from '@/services/ui-state.service';
import { LogoComponent } from '@/components/logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LogoComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly mobileOpen = signal(false);
  readonly transportOpen = signal(false);
  readonly moreOpen = signal(false);
  private readonly currentUrl: Signal<string>;

  constructor(
    readonly auth: AuthService,
    readonly cart: CartService,
    readonly i18n: I18nService,
    readonly ui: UiStateService,
    private readonly router: Router,
  ) {
    // openServices() nav items are buttons, not routerLinks, so routerLinkActive can't
    // track them — derive their active state from the URL + the shared tab signal instead.
    this.currentUrl = toSignal(
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects),
      ),
      { initialValue: this.router.url },
    );
  }

  isServicesTabActive(tab: ServiceTab): boolean {
    return this.currentUrl().startsWith('/services') && this.ui.allServicesTab() === tab;
  }

  isTransportActive(): boolean {
    return this.isServicesTabActive('vehicles') || this.currentUrl().startsWith('/taxi');
  }

  isMoreActive(): boolean {
    return this.currentUrl().startsWith('/handbook') || this.currentUrl().startsWith('/nearby-places');
  }

  toggleTransport(): void {
    this.moreOpen.set(false);
    this.transportOpen.update((o) => !o);
  }

  toggleMore(): void {
    this.transportOpen.set(false);
    this.moreOpen.update((o) => !o);
  }

  closeMenus(): void {
    this.mobileOpen.set(false);
    this.transportOpen.set(false);
    this.moreOpen.set(false);
  }

  openAuth(view: 'login' | 'register'): void {
    this.closeMenus();
    void this.router.navigateByUrl('/' + view);
  }

  openServices(tab: 'hotels' | 'vehicles' | 'activities' | 'attractions'): void {
    this.closeMenus();
    this.ui.openAllServices(tab);
  }

  logout(): void {
    this.closeMenus();
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
