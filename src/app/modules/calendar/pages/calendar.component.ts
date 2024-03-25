import {Component, OnInit, Signal} from '@angular/core';
import {MonthComponent} from "../components/month/month.component";
import {YearComponent} from "../components/year/year.component";
import {Day} from "../../../core/models/day.model";
import {Month} from "../../../core/models/month.model";
import {DateManagerService} from "../../../core/services/date-manager.service";

@Component({
  selector: 'app-pages',
  standalone: true,
    imports: [
        MonthComponent,
        YearComponent
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit{
  currentDate: Signal<Date>;
  days: Signal<Day[]>;
  activeMonth: Signal<Month>;

  constructor(private dateManagerService: DateManagerService) {
  }

  ngOnInit() {
    this.currentDate = this.dateManagerService.currentDate;
    this.activeMonth = this.dateManagerService.activeMonth;
    this.days = this.dateManagerService.days;
  }

  setPreviousYear(): void {
    this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear() - 1, this.activeMonth().currentMonth));
  }

  setNextYear(): void {
    this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear() + 1, this.activeMonth().currentMonth));
  }

  setNextMonth(): void {
    this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear(), this.activeMonth().currentMonth + 1))
  }

  setPreviousMonth(): void {
    this.dateManagerService.changeDate(new Date(this.currentDate().getFullYear(), this.activeMonth().currentMonth - 1))
  }

  updateDaysStore(days: Day[]): void {
    this.dateManagerService.updateDaysInStore(days);
  }

}
