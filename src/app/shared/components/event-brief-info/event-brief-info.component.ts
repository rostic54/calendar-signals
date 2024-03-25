import {Component, Input} from '@angular/core';
import {ScheduledEvent} from "../../../core/models/scheduledEvent";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-event-brief-info',
  standalone: true,
  imports: [
    NgIf,
    MatTooltip],
  templateUrl: './event-brief-info.component.html',
  styleUrl: './event-brief-info.component.scss'
})
export class EventBriefInfoComponent {
  @Input() event: ScheduledEvent;
}
