import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewClienteComponent } from './form-new-cliente.component';

describe('FormNewClienteComponent', () => {
  let component: FormNewClienteComponent;
  let fixture: ComponentFixture<FormNewClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNewClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNewClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
