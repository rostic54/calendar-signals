import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IEventDialogData} from "../../../../core/interfaces/interface";
import {EventCreateFormComponent} from "../../components/event-create-form/event-create-form.component";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-event-edit-dialog',
  standalone: true,
  imports: [
    EventCreateFormComponent,
    MatButton
  ],
  templateUrl: './event-edit-dialog.component.html',
  styleUrl: './event-edit-dialog.component.scss'
})
export class EventEditDialogComponent {
  appointment: ScheduledEvent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IEventDialogData,
              private dialogRef: MatDialogRef<EventEditDialogComponent>,
              private dateManagerService: DateManagerService) {
    this.appointment = data.appointment;
  }

  updateEvent(eventDetails: ScheduledEvent) {
    this.dateManagerService.createEventForParticularDate(eventDetails);
  this.closeDialog(`Appointment ${eventDetails.preciseTime} was edited`);
  }

  deleteEvent(eventId: number): void {
    this.dateManagerService.deleteEventFromStore(eventId).subscribe(result => {
      this.closeDialog(result ? `Appointment at ${this.appointment.preciseTime} was deleted` : 'Appointment was not deleted');
    });
  }

  closeDialog(result: string | null): void {
    this.dialogRef.close(result)
  }

}
