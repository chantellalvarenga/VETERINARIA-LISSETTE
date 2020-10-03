import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablavisitasComponent } from './tablavisitas.component';

describe('TablavisitasComponent', () => {
  let component: TablavisitasComponent;
  let fixture: ComponentFixture<TablavisitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablavisitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablavisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
