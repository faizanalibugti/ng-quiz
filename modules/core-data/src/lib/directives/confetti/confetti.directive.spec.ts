import { ElementRef } from '@angular/core';
import { ConfettiDirective } from './confetti.directive';

describe('ConfettiDirective', () => {
  let elementRef: ElementRef;
  let directive: ConfettiDirective;

  beforeEach(() => {
    directive = new ConfettiDirective(elementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
