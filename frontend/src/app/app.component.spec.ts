import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Orden } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('frontend app is running!');
  });

  it('should reset ordenSelect after saving', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Mock a value for ordenSelect
    app.ordenSelect = new Orden(1, 'Cliente 1', 50, '12345', 'Dirección 1');

    // Call the guardar() method to simulate saving
    app.guardar();

    // After saving, ordenSelect should be reset
    expect(app.ordenSelect).toEqual(new Orden(0, '', 0, '', ''));
  });

});
