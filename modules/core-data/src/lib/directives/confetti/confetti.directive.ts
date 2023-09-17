import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[angularQuizConfetti]',
})
export class ConfettiDirective implements OnInit {
  @Input() angularQuizConfetti!: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.angularQuizConfetti) {
      this.generateConfetti();
    }
  }

  generateConfetti() {
    let i = 100;

    while (i > -1) {
      const confetti = this.renderer.createElement('div');
      confetti.classList.add(`confetti-${i}`);

      this.renderer.appendChild(this.el.nativeElement, confetti);
      i--;
    }
  }
}
