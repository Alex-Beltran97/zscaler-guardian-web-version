import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js"

import bootstrapRaw from 'bootstrap/dist/css/bootstrap.min.css?inline';
import stylesInLine from './my-app.scss?inline';

import refreshAudio from './assets/refresh-sound.mp3'
import failAudio from './assets/fail-audio.mp3'

export const bootstrap = unsafeCSS(bootstrapRaw);
export const styles = unsafeCSS(stylesInLine);

@customElement("my-app")
export class MyApp extends LitElement {

  static styles = [css`${bootstrap}`, css`${styles}`];
  
  @property({ type: String }) private currentTime: string;
  @property({ type: Number }) private clock: number | undefined;
  @property({ type: Number }) private minutes: number = +import.meta.env.VITE_CLOCK_MINUTES || 0;
  @property({ type: Number }) private seconds: number = +import.meta.env.VITE_CLOCK_SECONDS || 0;
  @property({ type: Number }) private minutesLimit: number = +import.meta.env.VITE_CLOCK_MINUTES_LIMITS || 0;
  @property({ type: Boolean }) private hasStart: boolean = false;
  @property({ type: HTMLAudioElement }) private refreshAudio = new Audio(refreshAudio);
  @property({ type: HTMLAudioElement }) private failAudio = new Audio(failAudio);

  constructor() {
    super();
    this.currentTime = "00:00";
  }

  connectedCallbackCallback() {
    super.disconnectedCallback();
    this.handleStopClock();
    this.stopAlarmSound(this.refreshAudio);
    this.stopAlarmSound(this.failAudio);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.handleStopClock();
    this.stopAlarmSound(this.refreshAudio);
    this.stopAlarmSound(this.failAudio);
  }

  @query("#min-input")
    inputRanger!: HTMLInputElement;
  
  @query(".stopwatcher")
    stopwatcherLabel!: HTMLElement;

  private handleStartClock(): void {
    this.setHasStart = true;
    this.clock = setInterval(this.handlePrintClock.bind(this), 1000);
  }

  private handlePrintClock(): void {
    if (this.seconds === 59) {
      this.minutes += 1;
      this.seconds = 0;
    } else {
      this.seconds += 1;
    };
    this.setCurrentTime = `${String(this.minutes).toString().padStart(2, "0")}:${String(this.seconds).toString().padStart(2, "0")}`;
    this.handleAlarmsound();
  }

  private handleAlarmsound() {
    if (this.handleRefreshAlert() && !this.handleRefreshAlert(true)) {
      this.playAlarmSound(this.refreshAudio);
    } else {
      if (this.handleRefreshAlert(true)) {
        this.playAlarmSound(this.failAudio);
      }
      setTimeout(() => {
        this.stopAlarmSound(this.refreshAudio);
        this.stopAlarmSound(this.failAudio);
      }, 3000);
    };
  }

  private handleResetClock(): void {
    this.resetTimeValues();
    this.handleStartClock();
  }

  private handleStopClock(): void {
    this.setHasStart = false;
    this.resetTimeValues();
  }

  private handleGetRange(): void {
    this.setMinutesLimit = +this.inputRanger.value;
  }

  private resetTimeValues(): void {
    this.setCurrentTime = "00:00";
    this.minutes = +import.meta.env.VITE_CLOCK_MINUTES || 0;
    this.seconds = +import.meta.env.VITE_CLOCK_SECONDS || 0;
    clearInterval(this.clock);
  }

  private handleRefreshAlert(tooLate: boolean = false): boolean {
    return this.getHasStart && (this.getMinutesLimit - (tooLate ? 0 : 1)) <= this.getMinutes;
  }

  private canStart(): boolean {
    return !this.getHasStart && !this.getMinutesLimit;
  }

  private playAlarmSound(alarmType: HTMLAudioElement): void {
    alarmType.play();
  }

  private stopAlarmSound(alarmType: HTMLAudioElement): void {
    alarmType.pause();
    alarmType.currentTime = 0;
  }

  render() {
    return html`
      ${this.headerTpl}
      ${this.mainTpl}
      ${this.footerTpl}
    `;
  }

  private get headerTpl() {
    return html`
      <header>
        <h1 class="title">Zscaler Guardian</h1>
        <figure class="title__icon">
          <img src="https://res.cloudinary.com/duzyd4ju7/image/upload/v1770705939/logo_fyehob.png" />
        </figure>
      </header>
    `;
  }

  /**
   * Layouts
   */

  private get mainTpl() {
    return html`
      <main class="d-flex flex-column align-items-center g-1">
        ${this.minutesInputTpl}
        <hr />
        ${this.stopwatcherTpl}
        ${this.buttonGroupTpl}        
      </main>
    `;
  }

  private get footerTpl() {
    return html`
      <footer>
        <p>creado por:<p/>
        <p>Pedro Alexander Beltran Hernandez - 2026</p>
        <p>© Todos los derechos reservados</p>
      </footer>
    `;
  }

  /**
   * HTML Templates
   */

  private get minutesInputTpl() {
    return html`
      <div class="min_input">
        <p class="min-label text-start">Ingresa la cantidad de minutos que deseas calcular:</p>
        <input
          id="min-input"
          type="number"
          min="0"
          max="100"
          value="${this.getMinutesLimit}"
          @change="${this.handleGetRange}"
          .disabled="${this.getHasStart}"
        />
      </div>
    `;
  }

  private get stopwatcherTpl() {
    return html`
      <h2
        class="stopwatcher ${this.handleRefreshAlert() ? "alert_bg" : ""} ${this.handleRefreshAlert(true) ? "fail_bg" : ""}"
      >
        ${this.getCurrentTime}
      </h2>
    `;
  }

  private get buttonGroupTpl() {
    return html`
      <div class="d-flex align-items-center justify-content-center gap-1 mt-3">
        <button
          type="button"
          class="btn btn-success rounded py-2 px-3 py-lg-1 fs-5"
          @click="${this.handleStartClock}"
          .disabled="${this.canStart() || this.getHasStart}"
        >
            Iniciar
          </button>
        <button
          type="button"
          class="btn btn-danger rounded py-2 px-3 py-lg-1 fs-5"
          @click="${this.handleStopClock}"
          >
            Detener
        </button>
        ${this.handleRefreshAlert() ? html`
          <button
            type="button"
            class="btn btn-primary rounded py-2 px-3 py-lg-1 fs-5"
            @click="${this.handleResetClock}"
            .disabled="${this.handleRefreshAlert(true)}"
            >
              Reiniciar
          </button>
        `: ""}
      </div>
    `;
  }

  set setMinutesLimit(minutes: number) {
    this.minutesLimit = minutes ;
  }

  set setCurrentTime(minutes: string) {
    this.currentTime = minutes;
  }

  set setHasStart(status: boolean) {
    this.hasStart = status;
  }
  
  get getMinutes() {
    return this.minutes;
  }

  get getMinutesLimit() {
    return this.minutesLimit;
  }

  get getCurrentTime() {
    return this.currentTime;
  }

  get getHasStart() {
    return this.hasStart;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
