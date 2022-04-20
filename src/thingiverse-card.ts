/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getLovelace,
  hasAction,
  hasConfigOrEntityChanged,
  HomeAssistant,
  LovelaceCardEditor,
} from 'custom-card-helpers';
import { css, CSSResultGroup, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { repeat } from 'lit/directives/repeat.js';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import type { APIThingiverseResponse, ThingiverseCardConfig, ThingiverseResponse } from './types';

/* eslint no-console: 0 */
console.info(
  `%c  THINGIVERSE-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'thingiverse-card',
  name: 'Thingiverse Card',
  description: 'Display feeds of 3D models from Thingiverse',
});

@customElement('thingiverse-card')
export class ThingiverseCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('thingiverse-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  private getSeconds(value?: number): number {
    return value ? value * 1000 : 10000;
  }

  private generateURL(endpoint: string): string {
    const appendChar = endpoint.includes('?') ? '&' : '?';
    return `https://api.thingiverse.com/${endpoint}${appendChar}access_token=${this.config.api_key}&per_page=50`;
  }

  updateDisplayCards(values: string | any[]): void {
    if (values && values.length > 0) {
      this.displayedCards.shift();
      this.displayedCards.push(values[this.currentIndex]);
      this.currentIndex = (this.currentIndex + 1) % values.length;
      this.requestUpdate();
    }
    setTimeout(() => this.updateDisplayCards(values), this.getSeconds(this.config.timer_interval));
  }

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false })
  private apiResponse: Array<ThingiverseResponse> = [];

  @property({ attribute: false })
  private displayedCards: Array<ThingiverseResponse> = [];

  @property({ attribute: false })
  private currentIndex = 1;

  @state() private config!: ThingiverseCardConfig;

  public setConfig(config: ThingiverseCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      ...config,
      endpoints: config.endpoints || '',
      timer_interval: config.timer_interval || 5,
    };
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  async fetchThings(): Promise<void> {
    const results = await Promise.allSettled(
      this.config.endpoints.split(',').map((endpoint) => fetch(this.generateURL(endpoint))),
    );

    const responses = await Promise.allSettled(
      results
        .filter((result) => result.status === 'fulfilled')
        .map((p) => (p as unknown as PromiseFulfilledResult<Response>).value.json())
        .flat(),
    );

    this.apiResponse = responses
      .filter((result) => result.status === 'fulfilled')
      .map((p) => (p as unknown as PromiseFulfilledResult<APIThingiverseResponse>).value)
      .map((response) => response.hits)
      .flat();

    console.log(this.apiResponse);

    this.currentIndex =
      this.config.shuffle && this.apiResponse.length - 3 > 0 ? this.getRandomInt(this.apiResponse.length) : 0;

    for (let i = 0; i < 3; i++) {
      if (this.displayedCards.find((card) => card.id === this.apiResponse[this.currentIndex].id) == null) {
        this.displayedCards.push(this.apiResponse[this.currentIndex]);
        this.currentIndex++;
      }
    }

    setTimeout(() => this.updateDisplayCards(this.apiResponse), this.getSeconds(this.config.timer_interval));
  }

  protected firstUpdated(): void {
    this.fetchThings();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, true);
  }

  protected render(): TemplateResult | void {
    return html`
      ${repeat(
        this.displayedCards,
        (displayedCard) => displayedCard.id,
        (entry) =>
          html`<ha-card
            @action=${() => this._handleAction(entry.public_url)}
            .actionHandler=${actionHandler({
              hasHold: hasAction(this.config.hold_action),
              hasDoubleClick: hasAction(this.config.double_tap_action),
            })}
            .label=${entry?.name}
            tabindex="0"
          >
            <img src=${entry?.thumbnail} style="width: 100%; height: 100%;" />
            <h4>${entry?.name}</h4>
            <h5>${entry?.creator?.name}</h5>
            <img src="https://thingiverse.com/favicon.ico" style="width: 1.5rem; height: 1.5rem;" />
          </ha-card>`,
      )}
    `;
  }

  private _handleAction(public_url?: string): void {
    if (public_url) {
      window.open(public_url, '_blank');
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        padding: 1rem;
        margin-bottom: 0.75rem;
        cursor: pointer;
      }
    `;
  }
}
