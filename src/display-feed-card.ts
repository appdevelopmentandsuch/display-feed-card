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
import type { DisplayFeedCardConfig, DisplayCard } from './types';

/* eslint no-console: 0 */
console.info(
  `%c  DisplayFeed-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'display-feed-card',
  name: 'Display-Feed Card',
  description: 'Display feeds of entities from Display-Feed',
});

@customElement('display-feed-card')
export class DisplayFeedCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('display-feed-card-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false })
  private displayedCards: Array<DisplayCard> = [];

  @property({ attribute: false })
  private values: Array<DisplayCard> = [];

  @property({ attribute: false })
  private currentIndex = 1;

  @state() private config!: DisplayFeedCardConfig;

  public setConfig(config: DisplayFeedCardConfig): void {
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

  protected firstUpdated(): void {
    this.values = this.hass.states[this.config.entity].attributes.values;

    const max = this.values.length;

    this.currentIndex = this.config.shuffle && this.values.length - max > 0 ? this.getRandomInt(this.values.length) : 0;

    for (let i = 0; i < max; i++) {
      if (this.displayedCards.find((card) => card.id === this.values[this.currentIndex].id) == null) {
        this.displayedCards.push(this.values[this.currentIndex]);
        this.currentIndex++;
      }
    }
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
        this.hass.states[this.config.entity].attributes.values,
        (displayedCard: DisplayCard) => displayedCard.id,
        (entry) =>
          html`<ha-card
            @action=${() => this._handleAction(entry?.url)}
            .actionHandler=${actionHandler({
              hasHold: hasAction(this.config.hold_action),
              hasDoubleClick: hasAction(this.config.double_tap_action),
            })}
            .label=${entry?.name}
            tabindex="0"
          >
            ${entry?.image && html`<img src=${entry?.image} style="width: 100%; height: 100%;" />`}
            ${entry?.name && html`<h2>${entry?.name}</h2>`}
            ${entry?.creator && html`<h3>${entry?.creator}</h3>`}
            ${entry?.description && html`<p>${entry?.description}</p>`}
            ${entry?.favico && html`<img src=${entry?.favico} style="width: 1.5rem; height: 1.5rem;" />`}
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

      h2 {
        padding: 0.5rem;
      }

      h3 {
        padding: 0.5rem;
      }
    `;
  }
}
