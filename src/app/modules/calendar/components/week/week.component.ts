import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WeekDays} from "../../../../core/enams/enums";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Day} from "../../../../core/models/day.model";
import {WeekSeparatorPipe} from "../../../../core/pipes/week-separator.pipe";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {EventBriefInfoComponent} from "../../../../shared/components/event-brief-info/event-brief-info.component";
import {MatTooltip} from "@angular/material/tooltip";
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {Router} from "@angular/router";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-week',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    WeekSeparatorPipe,
    EventBriefInfoComponent,
    DragDropModule,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    MatTooltip,
    NgStyle,
  ],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent {

  @Input() days: Day[] = [];
  @Output() gotChanged: EventEmitter<Day[]> = new EventEmitter<Day[]>();
  private toValue: Day | null;
  private fromValue: Day | null;

  readonly week = [
    WeekDays.Monday,
    WeekDays.Tuesday,
    WeekDays.Wednesday,
    WeekDays.Thursday,
    WeekDays.Friday,
    WeekDays.Saturday,
    WeekDays.Sunday
  ];

  constructor(private dateManagerService: DateManagerService,
              private router: Router,
              private notificationService: NotificationService) {
  }
  drop(event: CdkDragDrop<ScheduledEvent[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
        transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.notificationService.openSnackBar('The appointment was postponed successfully.')
      this.gotChanged.emit([this.fromValue!, this.toValue!]);
      this.clear();
    }
  }

  entered(cell: Day) {
    this.toValue = cell;
  }

  exited(cell: Day) {
    this.fromValue = cell;
  }

  openDayDetails(x: number, y: number) {
    this.dateManagerService.setSelectedDay((x*7)+y);
    this.router.navigate(['day']);
  }

  clear() {
    this.toValue = null;
    this.fromValue = null;
  }
}
