import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {CdkVirtualForOf, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {HoursModel} from "../../../../core/models/hours.model";
import {HOURS_IN_DAY} from "../../../../core/constants/constants";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {NgFor, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {filter, Subject, takeUntil} from "rxjs";
import {DayEventHandlerService} from "../../services/day-event-handler.service";
import {scheduledEventFactory} from "../../../../core/factories/scheduled-event.factory";
import {createDateWithSpecifiedTime} from "../../../../core/utils/util";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {EventEditDialogComponent} from "../../dialogs/event-edit-dialog/event-edit-dialog.component";
import {IDeletePermissions} from "../general-day-info/general-day-info.component";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList, CdkDropListGroup, DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NotificationService} from "../../../../core/services/notification.service";

const virtualScrolling = [
  CdkVirtualScrollViewport,
  CdkVirtualForOf,
  ScrollingModule,
];

const dragAndDrop = [
  DragDropModule,
  CdkDrag,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup
]

@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [
    ...virtualScrolling,
    ...dragAndDrop,
    NgFor,
    NgIf,
    MatButton,
    RouterOutlet,
    MatDialogModule,
    EventEditDialogComponent
  ],
  providers: [
    DayEventHandlerService
  ],
  templateUrl: './day-details.component.html',
  styleUrl: './day-details.component.scss'
})
export class DayDetailsComponent implements OnInit, OnDestroy {
  hours: HoursModel[];
  connectedTo: string[] = [];
  isDeletable: IDeletePermissions = {isAllowed: true}
  private onDestroy$ = new Subject();

  constructor(private dateManagerService: DateManagerService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private dialog: MatDialog) {
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
    this.connectedTo.length = 0;
    this.hours = Array.from({length: HOURS_IN_DAY}, (value, index) => index)
      .map((index): HoursModel => {
        this.connectedTo.push('hour_' + index);
        const foundEvents: ScheduledEvent[] = dayEvents
          .map(({
                  currentDate,
                  content,
                  editable,
                  id
                }: ScheduledEvent) => scheduledEventFactory(currentDate, content, editable, id))
          .filter((event: ScheduledEvent) => event.dateHour === index)
        return new HoursModel(index, [...foundEvents]);
      })
  }

  openHourDetails(hour: HoursModel): void {
    this.router.navigate(['create', hour.timeNumber], {relativeTo: this.route});
  }

  setSelectedEventForEdit(event: Event, scheduledEvent: ScheduledEvent): void {
    event.stopPropagation();
    this.dialog.open(EventEditDialogComponent, {
      data: {
        appointment: scheduledEvent,
        permissionDelete: this.isDeletable
      },
      height: '400px',
      width: '600px',
    }).afterClosed()
      .pipe(filter(message => message))
      .subscribe((result: string) => {
          this.notificationService.openSnackBar(result)
        }
      )
  }

  drop(event: CdkDragDrop<ScheduledEvent[]>, hour: HoursModel) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const transferredEvent = event.container.data[event.currentIndex];

      const updatedDate = createDateWithSpecifiedTime(transferredEvent.currentDate, hour.timeNumber, transferredEvent.dateMinutes);
      const updatedEvent = scheduledEventFactory(updatedDate, transferredEvent.content, transferredEvent.editable, transferredEvent.id);
      this.updateStore(updatedEvent);
      this.notificationService.openSnackBar('The appointment was rescheduled successfully.')
    }
  }

  updateStore(updatedEvent: ScheduledEvent): void {
    this.dateManagerService.createEventForParticularDate(updatedEvent);

  }

  back() {
    this.router.navigate(['..'])
  }

  identify(index: number, item: ScheduledEvent): number {
    return item.id
  }
}
