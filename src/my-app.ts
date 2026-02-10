import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js"

import bootstrapRaw from 'bootstrap/dist/css/bootstrap.min.css?inline';
import stylesInLine from './my-app.scss?inline';
export const bootstrap = unsafeCSS(bootstrapRaw);
export const styles = unsafeCSS(stylesInLine);
@customElement("my-app")
export class MyApp extends LitElement {

  static styles = [css`${bootstrap}`, css`${styles}`];

  render() {
    return html`
      <header>
        <h1 class="title">Zscaler Guardian</h1>
      </header>
      <main class="d-flex flex-column align-items-center g-1">
        <div class="min_input">
          <p class="min-label text-start">Ingresa la cantidad de minutos que deseas calcular:</p>
          <input id="min-input" type="number" value="0" />
        </div>
        <hr />
        <h2 class="stopwatcher">0:00</h2>
        <div class="d-flex align-items-center justify-content-center gap-1 mt-3">
          <button type="button" class="btn btn-success rounded py-2 px-3 py-lg-1 fs-5">Iniciar</button>
          <button type="button" class="btn btn-danger rounded py-2 px-3 py-lg-1 fs-5">Detener</button>
        </div>
      </main>
      <footer>
        <p>creado por:<p/>
        <p>Pedro Alexander Beltran Hernandez - 2026</p>
        <p>© Todos los derechos reservados</p>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
