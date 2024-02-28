import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'ng-canvas-gauge',
  standalone: true,
  imports: [],
  templateUrl: './canvas-gauge.component.html',
  styleUrls: [`./canvas-gauge.component.scss`]
})
export class NgCanvasGaugeComponent {
  @Input({ required: true }) value: number = 0;
  @Input({ required: true }) max: number = 360;
  @Input({ required: false }) ticks: number = 5; // Number of ticks
  @Input({ required: false }) valueLabel: string = 'value'; // Number of ticks
  @Input({ required: false }) width: number = 200; // Number of ticks
  @Input({ required: false }) height: number = 200; // Number of ticks
  @Input({ required: false }) radius: number = 80; // Number of ticks
  // Reference to the canvas element
  @ViewChild('gaugeCanvas', { static: true }) gaugeCanvas!: ElementRef<HTMLCanvasElement>;

  // Canvas rendering context
  private ctx!: CanvasRenderingContext2D;

  // Center and radius of the gauge
  private center = { x: 100, y: 100 };
  

  private clampedValue!: number;

  // Lifecycle hook after the view is initialized
  ngAfterViewInit(): void {
    // Get the 2D rendering context of the canvas
    this.ctx = this.gaugeCanvas.nativeElement.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Adjust canvas size based on device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvasWidth = this.gaugeCanvas.nativeElement.width;
    const canvasHeight = this.gaugeCanvas.nativeElement.height;

    this.gaugeCanvas.nativeElement.width = canvasWidth * devicePixelRatio;
    this.gaugeCanvas.nativeElement.height = canvasHeight * devicePixelRatio;

    // Scale the canvas context
    this.ctx.scale(devicePixelRatio, devicePixelRatio);

    // Set the center coordinates based on the canvas size
    const centerX = this.gaugeCanvas.nativeElement.width / 2;
    const centerY = this.gaugeCanvas.nativeElement.height / 2;
    this.center.x = centerX;
    this.center.y = centerY;

    // Draw the initial gauge
    this.drawGauge();
  }

  // Method to draw the complete gauge
  private drawGauge() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.gaugeCanvas.nativeElement.width, this.gaugeCanvas.nativeElement.height);
    this.ctx.imageSmoothingEnabled = true;
    // Draw the 270-degree circle with two different radii and line widths
    this.draw270DegreeCircle(this.radius, 10);
    this.draw270DegreeCircle(this.radius - 13, 1);

    // Draw ticks, center circles, needle, and arc
    this.drawTicks();
    this.drawCenterCircle();
    this.drawNeedle();
    this.drawCenterCircle2();
    this.drawArc();
    this.drawLable(this.valueLabel);
  }

  // Lifecycle hook called when input properties change
  ngOnChanges(changes: SimpleChanges): void {
    // Check if 'value' or 'max' has changed
    if (changes['value'] || changes['max']) {
      this.clampedValue = Math.max(0, Math.min(this.value, this.max));
      // Update the needle transformation
      this.updateNeedleTransform();
    }
  }

  // Method to draw a 270-degree circle
  private draw270DegreeCircle(radius: number, lineWidth: number) {
    const startAngle = (-225 * Math.PI) / 180; // Start angle in radians
    const endAngle = ((-225 + 270) * Math.PI) / 180; // End angle in radians

    this.ctx.strokeStyle = '#D9D9D9'; // Stroke color
    this.ctx.lineWidth = lineWidth; // Stroke width

    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, radius, startAngle, endAngle);
    this.ctx.stroke();

    const endCircleX = this.center.x + this.radius * Math.cos(endAngle);
    const endCircleY = this.center.y + this.radius * Math.sin(endAngle);

    // Draw the circle
    this.ctx.beginPath();
    this.ctx.arc(endCircleX, endCircleY, lineWidth / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#D9D9D9";
    this.ctx.fill();

  }

  // Method to update the needle transformation
  updateNeedleTransform() {
    // Redraw the entire gauge when value or max changes
    this.drawGauge();
  }

  private drawArc() {
    const mainStartAngle = -225; // Start angle of the main circle in degrees

    // Convert degrees to radians
    const startAngle = (mainStartAngle * Math.PI) / 180;
    const endAngle = ((this.clampedValue / this.max) * 270 + mainStartAngle) * Math.PI / 180;

    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.radius, startAngle, endAngle);

    // Draw gradient border
    const gradient = this.ctx.createLinearGradient(0, 0, this.gaugeCanvas.nativeElement.width, 0);
    gradient.addColorStop(0, '#871f88');
    gradient.addColorStop(1, '#dc3291');
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 13;
    this.ctx.stroke();

    // Calculate the position of the circle at the end of the arc
    const circleRadius = 6; // Adjust the radius of the circle
    const endCircleX = this.center.x + this.radius * Math.cos(endAngle);
    const endCircleY = this.center.y + this.radius * Math.sin(endAngle);

    const startCircleX = this.center.x + this.radius * Math.cos(startAngle);
    const startCircleY = this.center.y + this.radius * Math.sin(startAngle);

    // Draw the circle
    this.ctx.beginPath();
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.arc(endCircleX, endCircleY, circleRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient; // Circle color
    this.ctx.fill();
    this.ctx.beginPath();

    this.ctx.arc(startCircleX, startCircleY, circleRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient; // Circle color
    this.ctx.fill();
    this.ctx.closePath();
  }


  // Method to draw the needle
  private drawNeedle() {
    const startAngle = (-225 * Math.PI) / 180; // Start angle in radians
    const needleLength = 40; // Adjust the length of the needle as needed
    const needleWidth = 12; // Adjust the width of the needle end

    const clampedValue = Math.max(0, Math.min(this.value, this.max));
    const angle = startAngle + (clampedValue / this.max) * Math.PI * 1.5;

    // Calculate needle points
    const needleTipX = this.center.x + needleLength * Math.cos(angle);
    const needleTipY = this.center.y + needleLength * Math.sin(angle);
    const needleBaseX = this.center.x - needleWidth * 0.5 * Math.cos(angle);
    const needleBaseY = this.center.y - needleWidth * 0.5 * Math.sin(angle);
    const needleLeftX = this.center.x + needleWidth * 0.5 * Math.cos(angle - Math.PI / 2);
    const needleLeftY = this.center.y + needleWidth * 0.5 * Math.sin(angle - Math.PI / 2);
    const needleRightX = this.center.x + needleWidth * 0.5 * Math.cos(angle + Math.PI / 2);
    const needleRightY = this.center.y + needleWidth * 0.5 * Math.sin(angle + Math.PI / 2);

    // Drawing the needle
    this.ctx.beginPath();
    this.ctx.moveTo(needleBaseX, needleBaseY);
    this.ctx.lineTo(needleLeftX, needleLeftY);
    this.ctx.lineTo(needleTipX, needleTipY);
    this.ctx.lineTo(needleRightX, needleRightY);
    this.ctx.fillStyle = '#E33492'; // Needle color
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Method to draw ticks around the gauge
  private drawTicks() {
    const centerX = this.gaugeCanvas.nativeElement.width / 2;
    const centerY = this.gaugeCanvas.nativeElement.height / 2;
    const radius = this.radius - 25; // Adjust this value to control the distance of ticks from the circle center
    const startAngle = (-225 * Math.PI) / 180; // Adjust based on your start angle

    // Apply tick styles
    this.ctx.fillStyle = '#58595B'; // Number color
    this.ctx.textAlign = 'center';
    this.ctx.font = '16px initial';

    for (let i = 0; i <= this.ticks; i++) { // Change condition to include the last tick
      const tickPosition = startAngle + ((i / this.ticks) * Math.PI * 1.5); // Adjust based on the total number of ticks and desired angle
      const tickX = centerX + radius * Math.cos(tickPosition);
      const tickY = centerY + radius * Math.sin(tickPosition);
      const tickValue = ((i / this.ticks) * this.max); // Adjust based on the total range

      // Draw each tick
      this.ctx.fillText(String(Math.round(tickValue)), tickX, tickY);
    }
  }

  // Method to draw a small center circle
  private drawCenterCircle() {
    const center = {
      x: this.gaugeCanvas.nativeElement.width / 2,
      y: this.gaugeCanvas.nativeElement.height / 2
    };
    const circleRadius = 10; // Adjust the radius of the circle as needed

    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, circleRadius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#D9D9D9'; // Circle color
    this.ctx.stroke();
    this.ctx.closePath();
  }

  // Method to draw a smaller center circle with a different color
  private drawCenterCircle2() {
    const center = {
      x: this.gaugeCanvas.nativeElement.width / 2,
      y: this.gaugeCanvas.nativeElement.height / 2
    };
    const circleRadius = 7; // Adjust the radius of the circle as needed

    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, circleRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#E33492'; // Circle color
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawLable(label: string) {


    // Set text style
    this.ctx.fillStyle = '#000'; // Text color
    this.ctx.font = '16px initial'; // Font style and size
    this.ctx.textAlign = 'center';

    // Calculate position at the bottom and center
    const centerX = this.gaugeCanvas.nativeElement.width / 2;
    const bottomY = this.gaugeCanvas.nativeElement.height - 10; // Adjust the distance from the bottom

    // Draw the text
    this.ctx.fillText(`${label} ${this.value}`, centerX, bottomY);
  }
}
