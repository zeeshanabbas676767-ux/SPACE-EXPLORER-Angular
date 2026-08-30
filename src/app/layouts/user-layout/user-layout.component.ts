import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../customer/components/navbar/navbar.component';
import { FooterComponent } from '../../customer/components/footer/footer.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './user-layout.component.html'
})
export class UserLayoutComponent {}
