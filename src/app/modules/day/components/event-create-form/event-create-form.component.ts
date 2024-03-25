import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ScheduledEvent} from "../../../../core/models/scheduledEvent";
import {scheduledEventFactory} from "../../../../core/factories/scheduled-event.factory";
import {createDateWithSpecifiedTime} from "../../../../core/utils/util";
import {filter, Subject, takeUntil} from "rxjs";
import {NgIf} from "@angular/common";
import {IDeletePermissions} from "../../pages/general-day-info/general-day-info.component";

@Component({
  selector: 'app-event-create-form',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './event-create-form.component.html',
  styleUrl: './event-create-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCreateFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() date: Date;
  @Input() eventDetails: ScheduledEvent | undefined;
  @Input() specificHour: {hours: string};
  @Input() isDeletable: IDeletePermissions;
  @Output() submitFormValue: EventEmitter<ScheduledEvent> = new EventEmitter<ScheduledEvent>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  isDisabledSubmitBtn = true;
  private destroy$ = new Subject();

  eventForm: FormGroup;
  private _validSpecifiedHour: string;

  constructor(
    private fb: FormBuilder) {
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.initForm();
    this.formChangesListening();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventDetails']?.currentValue) {
      this.setForm(changes['eventDetails'].currentValue);
    } else if (changes['specificHour']?.currentValue.hours) {
      this._validSpecifiedHour = this.specificHour.hours.padStart(2, '0');
      const eventWithTime = this.createEvent(+changes['specificHour']?.currentValue.hours)
      this.setForm(eventWithTime);
    }
    this.formChangesListening();
  }

  initForm(): void {
    if (!this.eventForm) {
      this.eventForm = this.fb.group({
        title: ['', [Validators.required, Validators.max(50)]],
        time: ['', Validators.required]
      })
      this.eventForm.disable();
    }
  }

  setForm(values: ScheduledEvent): void {
    if (this.eventForm) {
      this.eventForm.patchValue({
        title: values.content,
        time: values.preciseTime
      })
      this.eventForm.enable();
    } else {
      this.initForm();
      this.setForm(values);
    }
  }

  submitForm(): void {
    this.isDisabledSubmitBtn = true;
    const formValue = this.eventForm.value;
    const [hours, minutes] = formValue.time.split(':');
    const newEvent = this.createEvent(hours, minutes, formValue.title);
    this.submitFormValue.emit(newEvent);
    if(this._validSpecifiedHour) {
      this.eventForm.reset({title: '', time: this._validSpecifiedHour + ':00'});
    } else {
      this.eventForm.reset(null, {emitEvent: false});
      this.eventForm.disable();
    }
  }

  deleteEvent(): void{
    this.isDisabledSubmitBtn = true;
    this.deleteItem.emit(this.eventDetails?.id);
    this.eventForm.reset(null, {emitEvent: false});
    this.eventForm.disable();
  }

  formChangesListening(): void {
    this.eventForm?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(value => Object.values(value).some(v => v))
      )
      .subscribe(value => {
        this.isDisabledSubmitBtn = !(value.title) || !value.time;
        const hours = value.time.split(':')[0];
        if (this._validSpecifiedHour && hours !== this._validSpecifiedHour) {
          this.eventForm.get('time')?.setValue(`${this._validSpecifiedHour}${value.time.slice(2)}`)
        }
      })
  }

  private createEvent(hours: number, minutes = 0, content?: string): ScheduledEvent {
    return scheduledEventFactory(createDateWithSpecifiedTime(this.date, hours, minutes), content);
  }
}


