import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WeekDays} from "../../../../core/enams/enums";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Day} from "../../../../core/models/day.model";
import {WeekSeparatorPipe} from "../../../../core/pipes/week-separator.pipe";
import {
  CdkDrag,
  CdkDragDrop, CdkDragEnter, CdkDragExit,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup, DragDropModule, moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {EventBriefInfoComponent} from "../../../../shared/components/event-brief-info/event-brief-info.component";
import {MatTooltip} from "@angular/material/tooltip";
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {Router} from "@angular/router";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {createDateInstance} from "../../../../core/utils/util";
import {scheduledEventFactory} from "../../../../core/factories/scheduled-event.factory";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

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
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDropListGroup,
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


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
              private _snackBar: MatSnackBar) {
  }

  openSnackBar(content: string) {
    this._snackBar.open(content, 'Dismiss', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  drop(event: CdkDragDrop<ScheduledEvent[]>) {
    if (event.previousContainer === event.container || this.checkIfThisTimeIsOccupied(event.previousContainer.data[event.previousIndex], event.container.data)) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.openSnackBar('The appointment was postponed successfully.')
      this.gotChanged.emit([this.fromValue!, this.toValue!]);
      this.clear();
    }
  }

  entered(el: CdkDragEnter<ScheduledEvent[], ScheduledEvent[]>, cell: Day) {
    this.toValue = cell;
  }

  exited(el: CdkDragExit<ScheduledEvent[], ScheduledEvent[]>, cell: Day) {
    this.fromValue = cell;
  }

  checkIfThisTimeIsOccupied(scheduledEvent: ScheduledEvent, targetContainer: ScheduledEvent[]): boolean {
    const {currentDate, content, editable, id  } = scheduledEvent
    const scheduledEventInstance = scheduledEventFactory(currentDate, content, editable, id);
    const hasAlreadyEventForThisTime = targetContainer.some(({currentDate, content, editable, id  }: ScheduledEvent) => {
      const targetContainerInstance = scheduledEventFactory(currentDate, content, editable, id);
      return targetContainerInstance.dateHour === scheduledEventInstance.dateHour && targetContainerInstance.dateMinutes === scheduledEventInstance.dateMinutes
    })
    if(hasAlreadyEventForThisTime) {
      this.openSnackBar('Event for this time already exist, edit time please')
    }
    return hasAlreadyEventForThisTime;
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
