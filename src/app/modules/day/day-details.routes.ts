import {Routes} from "@angular/router";
import {DayDetailsComponent} from "./pages/day-details/day-details.component";
import {GeneralDayInfoComponent} from "./pages/general-day-info/general-day-info.component";
import {SpecificHourComponent} from "./pages/specific-hour/specific-hour.component";
export const DAY_DETAILS_ROUTES: Routes = [
  {
    path: '',
    component: DayDetailsComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'edit'},
      {path: 'edit', component: GeneralDayInfoComponent },
      {path: 'create/:id', component: SpecificHourComponent },
    ]
  }
]
