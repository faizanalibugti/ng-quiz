import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { Confetti } from './confetti.model';

@Directive({
  selector: '[angularQuizConfetti]',
})
export class ConfettiDirective implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private cx!: number;
  private cy!: number;
  private confetti: Confetti[] = [];
  private confettiCount = 300;
  private gravity = 0.5;
  private terminalVelocity = 5;
  private drag = 0.075;
  private colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' },
  ];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.canvas = this.el.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.cx = this.ctx.canvas.width / 2;
    this.cy = this.ctx.canvas.height / 2;

    this.initConfetti();
    this.render();
    this.resizeCanvas();
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
    this.cx = this.ctx.canvas.width / 2;
    this.cy = this.ctx.canvas.height / 2;
  }

  private initConfetti() {
    this.confetti = [];
    for (let i = 0; i < this.confettiCount; i++) {
      this.confetti.push({
        color: this.colors[Math.floor(this.randomRange(0, this.colors.length))],
        dimensions: {
          x: this.randomRange(10, 20),
          y: this.randomRange(10, 30),
        },
        position: {
          x: this.randomRange(0, this.canvas.width),
          y: this.canvas.height - 1,
        },
        rotation: this.randomRange(0, 2 * Math.PI),
        scale: {
          x: 1,
          y: 1,
        },
        velocity: {
          x: this.randomRange(-25, 25),
          y: this.randomRange(0, -50),
        },
      });
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.confetti.forEach((confetto, index) => {
      const width = confetto.dimensions.x * confetto.scale.x;
      const height = confetto.dimensions.y * confetto.scale.y;

      this.ctx.translate(confetto.position.x, confetto.position.y);
      this.ctx.rotate(confetto.rotation);

      confetto.velocity.x -= confetto.velocity.x * this.drag;
      confetto.velocity.y = Math.min(
        confetto.velocity.y + this.gravity,
        this.terminalVelocity
      );
      confetto.velocity.x +=
        Math.random() > 0.5 ? Math.random() : -Math.random();

      confetto.position.x += confetto.velocity.x;
      confetto.position.y += confetto.velocity.y;

      if (confetto.position.y >= this.canvas.height)
        this.confetti.splice(index, 1);

      if (confetto.position.x > this.canvas.width) confetto.position.x = 0;
      if (confetto.position.x < 0) confetto.position.x = this.canvas.width;

      confetto.scale.y = Math.cos(confetto.position.y * 0.1);
      this.ctx.fillStyle =
        confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

      this.ctx.fillRect(-width / 2, -height / 2, width, height);

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    if (this.confetti.length <= 10) this.initConfetti();

    window.requestAnimationFrame(() => this.render());
  }
}
