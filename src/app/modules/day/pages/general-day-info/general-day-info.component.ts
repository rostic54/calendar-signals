import {Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {Day} from "../../../../core/models/day.model";
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {EventCreateFormComponent} from "../../components/event-create-form/event-create-form.component";
import {filter, Subject} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {scheduledEventFactory} from "../../../../core/factories/scheduled-event.factory";
import {EventEditDialogComponent} from "../../dialogs/event-edit-dialog/event-edit-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {NotificationService} from "../../../../core/services/notification.service";

export interface IDeletePermissions {
  isAllowed: boolean
}
@Component({
  selector: 'app-general-day-info',
  standalone: true,
  imports: [
    NgForOf,
    NgIf, MatFormField,
    MatLabel,
    MatOption,
    EventCreateFormComponent,
    FormsModule,
    ReactiveFormsModule, MatButton],
  templateUrl: './general-day-info.component.html',
  styleUrl: './general-day-info.component.scss'
})
export class GeneralDayInfoComponent implements OnInit, OnDestroy {
  currentDayInfo: Signal<Day>;
  eventsList: ScheduledEvent[];
  private destroy$ = new Subject();

  constructor(private dateManagerService: DateManagerService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.currentDayInfo = this.dateManagerService.selectedDay;
    this.eventsList = this.currentDayInfo().events;
  }

  setSelectedEventForEdit(): void {
    const event = this.createNewEvent(this.currentDayInfo().date)
    this.dialog.open(EventEditDialogComponent, {
      data: {
        appointment: event,
        permissionDelete: false
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

  private createNewEvent(date: Date): ScheduledEvent {
    return scheduledEventFactory(date);
  }
}
