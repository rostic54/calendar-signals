import {Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {Day} from "../../../../core/models/day.model";
import {DateManagerService} from "../../../../core/services/date-manager.service";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {EventCreateFormComponent} from "../../components/event-create-form/event-create-form.component";
import {DayEventHandlerService} from "../../services/day-event-handler.service";
import {Subject, takeUntil} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {scheduledEventFactory} from "../../../../core/factories/scheduled-event.factory";
import {createDateInstance} from "../../../../core/utils/util";

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
    ReactiveFormsModule],
  templateUrl: './general-day-info.component.html',
  styleUrl: './general-day-info.component.scss'
})
export class GeneralDayInfoComponent implements OnInit, OnDestroy {
  currentDayInfo: Signal<Day>;
  selectedEventId: string;
  eventDetails: ScheduledEvent | undefined;
  eventsList: ScheduledEvent[];
  isDeletable: IDeletePermissions = {isAllowed: true}
  private destroy$ = new Subject();

  constructor(private dateManagerService: DateManagerService,
              private dayEventHandler: DayEventHandlerService) {
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.currentDayInfo = this.dateManagerService.selectedDay;
    this.eventsList = this.currentDayInfo().events;
    this.dayEventHandler.selectedEvent
      .pipe(
        takeUntil(this.destroy$))
      .subscribe((selectedEvent: ScheduledEvent | null) => {
          if (selectedEvent) {
            this.selectedEventId = selectedEvent.id.toString();
            this.setSelectedEvent(selectedEvent.id);
          }
        }
      )
  }

  setSelectedEvent(eventId: number) {
    const scheduledEvent = this.currentDayInfo().events
      .find((event: ScheduledEvent) => event.id === eventId);
    this.eventDetails = scheduledEventFactory(createDateInstance(scheduledEvent!.currentDate), scheduledEvent!.content, scheduledEvent!.editable, scheduledEvent!.id);
  }

  updateEvent(eventDetails: ScheduledEvent) {
    if(this.selectedEventId) {
      eventDetails.id = +this.selectedEventId;
    }
    this.dateManagerService.createEventForParticularDate(eventDetails);
    this.eventDetails = undefined;
  }

  deleteEvent(eventId: number): void {
    this.dateManagerService.deleteEventFromStore(eventId);
  }

}
