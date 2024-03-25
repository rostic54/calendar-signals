import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {CdkVirtualForOf, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {HoursModel} from "../../../../core/models/hours.model";
import {HOURS_IN_DAY} from "../../../../core/constants/constants";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {AsyncPipe, NgFor, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {Subject, takeUntil} from "rxjs";
import {DayEventHandlerService} from "../../services/day-event-handler.service";
import {scheduledEventFactory} from "../../../../core/factories/scheduled-event.factory";
import {createDateInstance} from "../../../../core/utils/util";

@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    ScrollingModule,
    NgFor,
    NgIf,
    MatButton,
    RouterOutlet,
    AsyncPipe
  ],
  providers:[
    DayEventHandlerService
  ],
  templateUrl: './day-details.component.html',
  styleUrl: './day-details.component.scss'
})
export class DayDetailsComponent implements OnInit, OnDestroy {
  hours: HoursModel[];
  private onDestroy$ = new Subject();

  constructor(private dateManagerService: DateManagerService,
              private router: Router,
              private route: ActivatedRoute,
              private dayEventHandlerService: DayEventHandlerService) {
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.dateManagerService.getSelectedDay$.pipe(
      takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
      this.buildHours(this.dateManagerService.selectedDay().events);
    });
      this.buildHours(this.dateManagerService.selectedDay().events);
  }

  buildHours(dayEvents: ScheduledEvent[]) {
    this.hours = Array.from({length: HOURS_IN_DAY}, (value, index) => index)
      .map(( index): HoursModel => {
      const foundEvents: ScheduledEvent[] = dayEvents
        .map(({currentDate, content, editable, id}: ScheduledEvent) => scheduledEventFactory(createDateInstance(currentDate), content, editable, id))
        .filter((event: ScheduledEvent) => event.dateHour === index)
      return new HoursModel(index , [...foundEvents]);
    })
  }

  openHourDetails(hour: HoursModel): void {
    this.router.navigate(['create', hour.timeNumber], {relativeTo: this.route});
  }

  setSelectedEventForEdit(event: Event, scheduledEvent: ScheduledEvent): void {
    event.stopPropagation();
    this.dayEventHandlerService.setEventForEdit(scheduledEvent);
  }

  back() {
    this.router.navigate(['..'])
  }
}
