# ng-canvas-gauge

ng-canvas-gauge is an Angular component for creating a customizable gauge with a 270-degree scale.

![Snapshot](https://github.com/alimirdeveloper/ng-canvas-gauge/raw/main/src/assets/images/snapshot/snapshot.PNG)

## Features

- Display values on a 270-degree circular scale.
- Customizable ticks and colors.
- Animated needle movement.

## Installation

1. Install the ng-canvas-gauge component:

   ```bash
   npm install ng-canvas-gauge

2. Import the NgCanvasGaugeComponent in your Angular module:
   ```
   import { NgCanvasGaugeComponent } from 'ng-canvas-gauge';

    // ...
    
    @NgModule({
      declarations: [
        NgCanvasGaugeComponent,
        // ...
      ],
      // ...
    })
    export class YourModule { }

3. Use the ng-canvas-gauge component in your template:
  ```
  <ng-canvas-gauge
    [value]="yourValue"
    [max]="yourMaxValue"
    [radius]="120"
    [width]="400"
    [height]="400"
    [ticks]="yourNumberOfTicks">
  </ng-canvas-gauge>
  ```

Replace yourValue, yourMaxValue, and yourNumberOfTicks with your desired values.
  


## API

### Inputs

* value: The current value to be displayed on the gauge.
* max: The maximum value of the gauge scale.
* ticks: The number of ticks to be displayed on the gauge.
* radius : the gauge radius ( default is 80)
* width : width of the canvas (default is 200)
* height : height of the canvas ( default is 200)
