import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CubeComponent } from './cube/cube.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
