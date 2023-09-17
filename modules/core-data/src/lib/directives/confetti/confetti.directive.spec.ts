import { ElementRef, Renderer2 } from '@angular/core';
import { ConfettiDirective } from './confetti.directive';

describe('ConfettiDirective', () => {
  let elementRef: ElementRef;
  let directive: ConfettiDirective;
  let mockRenderer: Renderer2;

  beforeEach(() => {
    mockRenderer = {
      createElement: jest.fn(),
      appendChild: jest.fn(),
    } as unknown as Renderer2;

    directive = new ConfettiDirective(elementRef, mockRenderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
