import { Routes } from '@angular/router';
import {CalendarComponent} from "./modules/calendar/pages/calendar.component";

export const routes: Routes = [
  {path: '', component: CalendarComponent},
  {path: 'day', loadChildren: () => import('./modules/day/day-details.routes')
      .then(mod => mod.DAY_DETAILS_ROUTES)}
];
