import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-traffic-signal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traffic-signal.html',
  styleUrls: ['./traffic-signal.scss']
})
export class TrafficSignal implements OnChanges {

  @Input() mode: 'auto' | 'manual' = 'manual';
  @Input() interval = 2000;

  @Output() lightChanged = new EventEmitter<'red' | 'yellow' | 'green'>();

  activeLight: 'red' | 'yellow' | 'green' = 'red';
  countdown: number | null = null;
  private timerId: any = null;

  lightDurations = { red: 7, yellow: 3, green: 6 };

  resetManualState() {
    this.activeLight = 'red';
    this.countdown = null;
    this.lightChanged.emit(this.activeLight);
  }

  resetAutoState() {
    this.activeLight = 'red';
    this.countdown = this.lightDurations['red'];
    this.lightChanged.emit(this.activeLight);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      if (this.mode === 'auto') {
        this.startAuto();
      } else {
        this.stopAuto();
        this.resetManualState();
      }
    }
  }

  cycleLightForAuto() {
    if (this.activeLight === 'red') this.activeLight = 'yellow';
    else if (this.activeLight === 'yellow') this.activeLight = 'green';
    else this.activeLight = 'red';

    this.countdown = this.lightDurations[this.activeLight];
    this.lightChanged.emit(this.activeLight);
  }

  startAuto() {
    this.stopAuto();       
    this.resetAutoState(); 

    this.timerId = setInterval(() => {
      if (this.countdown !== null) {
        this.countdown--;
      }

      if (this.countdown !== null && this.countdown <= 0 && this.mode === 'auto') {
        this.cycleLightForAuto();
      }
    }, 1000);
  }

  stopAuto() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  cycleLightForManual() {
    if (this.activeLight === 'red') this.activeLight = 'yellow';
    else if (this.activeLight === 'yellow') this.activeLight = 'green';
    else this.activeLight = 'red';

    this.lightChanged.emit(this.activeLight);
  }

  manualNext() {
    this.cycleLightForManual();
  }

}
