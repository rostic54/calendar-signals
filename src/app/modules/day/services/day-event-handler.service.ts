import {Injectable} from '@angular/core';
import {ScheduledEvent} from "../../../core/models/scheduledEvent";
import {BehaviorSubject, Observable} from "rxjs";
import {scheduledEventFactory} from "../../../core/factories/scheduled-event.factory";

@Injectable()
export class DayEventHandlerService {
  private _selectedEventForEdit: BehaviorSubject<ScheduledEvent | null> = new BehaviorSubject<ScheduledEvent | null>(null)

  get selectedEvent(): Observable<ScheduledEvent | null> {
    return this._selectedEventForEdit.asObservable();
  }
  constructor() { }

  setEventForEdit({currentDate, content, editable, id}: ScheduledEvent): void {
    this._selectedEventForEdit.next(scheduledEventFactory(currentDate, content, editable, id));
  }

}
