import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {YearComponent} from "../year/year.component";
import {WeekComponent} from "../week/week.component";
import {Month} from "../../../../core/models/month.model";
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {Day} from "../../../../core/models/day.model";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-month',
  standalone: true,
  imports: [
    YearComponent,
    WeekComponent,
    MatButton
  ],
  templateUrl: './month.component.html',
  styleUrl: './month.component.scss'
})
export class MonthComponent implements OnInit {
  @Input() activeMonth: Month;
  @Input() days: Day[];
  @Output() setPreviousMonth: EventEmitter<void> = new EventEmitter<void>();
  @Output() setNextMonth: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateStore: EventEmitter<Day[]> = new EventEmitter<Day[]>();
  dayNumber: number;

  constructor(private dateManagerService: DateManagerService) {
  }

  ngOnInit() {
    this.dayNumber = this.dateManagerService.currentDate().getDate();
  }

  previousMonth() {
    this.setPreviousMonth.emit();
  }

  nextMonth() {
    this.setNextMonth.emit();
  }

  sendUpdateStore(days: Day[]): void {
    this.updateStore.emit(days);
  }


}
