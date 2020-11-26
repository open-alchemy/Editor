import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PrimaryKeyComponent } from './primary-key.component';

/* tslint:disable:component-selector */
@Component({ selector: 'mat-chip', template: '' })
class MatChipStubComponent {}

describe('PrimaryKeyComponent', () => {
  let component: PrimaryKeyComponent;
  let fixture: ComponentFixture<PrimaryKeyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimaryKeyComponent, MatChipStubComponent],
    });

    fixture = TestBed.createComponent(PrimaryKeyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display badge', () => {
    fixture.detectChanges();

    const chipDebugElement = fixture.debugElement.query(
      By.directive(MatChipStubComponent)
    );
    expect(chipDebugElement).toBeTruthy();
    const chip = chipDebugElement.injector.get(MatChipStubComponent);
    expect(chip).toBeTruthy();
  });
});
