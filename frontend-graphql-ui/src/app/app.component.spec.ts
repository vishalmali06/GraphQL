import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
// import { Component } from '@angular/core';

describe('AppComponent', () => {
let componet: AppComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'graph-ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('graph-ui');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    componet.title = "graph-ui";
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title : HTMLElement = fixture.nativeElement.querySelector('title');
    expect(title?.textContent).toContain('graph-ui app is running!');
  });
});
