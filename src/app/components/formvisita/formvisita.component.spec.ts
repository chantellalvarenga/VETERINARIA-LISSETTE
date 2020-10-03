import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormvisitaComponent } from './formvisita.component';

describe('FormvisitaComponent', () => {
  let component: FormvisitaComponent;
  let fixture: ComponentFixture<FormvisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormvisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormvisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
