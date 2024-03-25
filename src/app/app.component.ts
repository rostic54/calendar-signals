import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MonthComponent} from "./modules/calendar/components/month/month.component";
import {YearComponent} from "./modules/calendar/components/year/year.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MonthComponent, YearComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {
    this.router.navigate([''])
  }

}
