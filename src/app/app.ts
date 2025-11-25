import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrafficSignal } from './traffic-signal/traffic-signal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TrafficSignal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Traffic-signal');
  // Parent decides mode → this value goes to child
  trafficMode: 'auto' | 'manual' = 'manual';

  // Child → Parent
  currentLight: 'red' | 'yellow' | 'green' = 'red';

  // Parent sends interval to child for auto mode
  trafficInterval = 1000;

  enableAutoMode() {
    this.trafficMode = 'auto';
  }

  enableManualMode() {
    this.trafficMode = 'manual';
  }
   //  This fixes the error
  onLightChange(light: 'red' | 'yellow' | 'green') {
    this.currentLight = light;
    console.log('Light changed to:', light);
  }
}
