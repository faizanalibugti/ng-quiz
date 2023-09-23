import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { Colors, Confetti } from './confetti.model';

@Directive({
  selector: '[angularQuizConfetti]',
})
export class ConfettiDirective implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private confetti: Confetti[] = [];
  private confettiCount = 100;
  private gravity = 0.5;
  private terminalVelocity = 5;
  private drag = 0.075;
  private colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'pink',
    'purple',
    'turquoise',
  ];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.canvas = this.el.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.resizeCanvas();

    this.initConfetti();
    this.render();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas();
  }

  @HostListener('window:click', ['$event'])
  onClick(event: Event) {
    this.initConfetti();
  }

  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private initConfetti() {
    this.confetti = Array.from({ length: this.confettiCount }, () => ({
      color: this.colors[
        Math.floor(this.randomRange(0, this.colors.length))
      ] as Colors,
      dimensions: { x: this.randomRange(10, 20), y: this.randomRange(10, 30) },
      position: {
        x: this.randomRange(0, this.canvas.width),
        y: this.canvas.height - 1,
      },
      rotation: this.randomRange(0, 2 * Math.PI),
      scale: { x: 1, y: 1 },
      velocity: { x: this.randomRange(-25, 25), y: this.randomRange(0, -50) },
    }));
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.confetti.forEach((confetto) => {
      const { x, y } = confetto.position;
      const { x: vx, y: vy } = confetto.velocity;
      const { x: scaleX, y: scaleY } = confetto.scale;

      const width = confetto.dimensions.x * scaleX;
      const height = confetto.dimensions.y * scaleY;

      this.ctx.translate(x, y);
      this.ctx.rotate(confetto.rotation);

      confetto.velocity.x -= vx * this.drag;
      confetto.velocity.y = Math.min(vy + this.gravity, this.terminalVelocity);
      confetto.velocity.x +=
        Math.random() > 0.5 ? Math.random() : -Math.random();

      confetto.position.x += vx;
      confetto.position.y += vy;

      if (y >= this.canvas.height) {
        // Reset confetto if it falls off the screen
        confetto.position.x = this.randomRange(0, this.canvas.width);
        confetto.position.y = -confetto.dimensions.y;
      }

      confetto.scale.y = Math.cos(y * 0.1);
      this.ctx.fillStyle =
        confetto.scale.y > 0 ? confetto.color : 'dark' + confetto.color;

      this.ctx.fillRect(-width / 2, -height / 2, width, height);

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    window.requestAnimationFrame(() => this.render());
  }
}
