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

  @Input() mode: 'auto' | 'manual' | 'night' | 'emergency' = 'manual';
  @Input() interval = 1000;

  @Output() lightChanged = new EventEmitter<'red' | 'yellow' | 'green'>();

  activeLight: 'red' | 'yellow' | 'green' = 'red';
  RemainingTime: number | null = null;
  countdown: number | null = null;

  text = '';
  isBlinking = false;

  private timerId: any = null;            // AUTO mode timer
  private nightBlinkId: any = null;       // NIGHT blink timer
  private emergencyBlinkId: any = null;   // EMERGENCY blink timer

  // Prevent NIGHT mode double-initialization
  private isNightInitializing: boolean = false;

  lightDurations = {
    red: 7,
    yellow: 3,
    green: 6
  };

  lightText = {
    red: 'stop',
    yellow: 'ready',
    green: 'go'
  };
  // MODE CHANGES
  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {

      this.stopAllTimers();

      if (this.mode === 'auto') this.startAuto();
      else if (this.mode === 'manual') this.resetManualState();
      else if (this.mode === 'night') this.NightMode();
      else if (this.mode === 'emergency') this.activateEmergency();
    }
  }
  // STOP ALL TIMERS
  stopAllTimers() {
    console.log("⚠ STOPPING ALL TIMERS");

    this.stopAuto();
    this.stopNightMode();
    this.stopEmergency();

    console.log("AUTO ID NOW:", this.timerId);
    console.log("NIGHT ID NOW:", this.nightBlinkId);
    console.log("EMERGENCY ID NOW:", this.emergencyBlinkId);
  }
  // MANUAL MODE
  resetManualState() {

    this.activeLight = 'red';
    this.countdown = null;
    this.text = this.lightText['red'];
    this.lightChanged.emit(this.activeLight);
  }

  cycleLightForManual() {
    if (this.activeLight === 'red') this.activeLight = 'yellow';
    else if (this.activeLight === 'yellow') this.activeLight = 'green';
    else this.activeLight = 'red';

    this.text = this.lightText[this.activeLight];
    this.lightChanged.emit(this.activeLight);
  }
  // AUTO MODE
  startAuto() {
    this.stopAuto();
    this.resetAutoState();

    this.timerId = setInterval(() => {
      if (this.countdown !== null) {
        this.countdown--;
      }

      this.RemainingTime = this.countdown;

      if (this.countdown !== null && this.countdown <= 0 && this.mode === 'auto') {
        this.cycleLightForAuto();
      }
    }, 1000);
  }

  resetAutoState() {
    this.activeLight = 'red';
    this.countdown = this.lightDurations['red'];
    this.text = this.lightText['red'];
    this.RemainingTime = this.countdown;
    this.lightChanged.emit(this.activeLight);
  }

  cycleLightForAuto() {
    if (this.activeLight === 'red') this.activeLight = 'yellow';
    else if (this.activeLight === 'yellow') this.activeLight = 'green';
    else this.activeLight = 'red';

    this.countdown = this.lightDurations[this.activeLight];
    this.RemainingTime = this.countdown;
    this.text = this.lightText[this.activeLight];

    this.lightChanged.emit(this.activeLight);
  }

  stopAuto() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // NIGHT MODE (with safety lock)
  NightMode() {

    if (this.isNightInitializing) return;
    this.isNightInitializing = true;

    this.activeLight = 'yellow';
    this.isBlinking = false;
    this.text = '';

    if (this.nightBlinkId) {
      clearInterval(this.nightBlinkId);
      this.nightBlinkId = null;
    }

    // Delay ensures DOM updates before blinking starts
    setTimeout(() => {
      this.nightBlinkId = setInterval(() => {
        this.isBlinking = !this.isBlinking;
      }, 500);

      this.isNightInitializing = false;
    }, 50);
  }

  stopNightMode() {
    if (this.nightBlinkId) {
      clearInterval(this.nightBlinkId);
      this.nightBlinkId = null;
    }

    this.isBlinking = false;
    this.isNightInitializing = false;
  }

  // EMERGENCY MODE
  activateEmergency() {

    this.activeLight = 'green';
    this.text = '';

    if (this.emergencyBlinkId) {
      clearInterval(this.emergencyBlinkId);
      this.emergencyBlinkId = null;
    }

    this.emergencyBlinkId = setInterval(() => {
      this.isBlinking = !this.isBlinking;
    }, 500);

    this.lightChanged.emit(this.activeLight);
  }

  stopEmergency() {
    if (this.emergencyBlinkId) {
      clearInterval(this.emergencyBlinkId);
      this.emergencyBlinkId = null;
    }

    this.isBlinking = false;
  }
}
