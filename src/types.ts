import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'display-feed-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export interface DisplayCard {
  id: string;
  name?: string;
  creator?: string;
  description?: string;
  image?: string;
  url?: string;
  favico?: string;
}

export interface DisplayFeedCardConfig extends LovelaceCardConfig {
  type: string;
  test_gui?: boolean;
  entity: string;
  shuffle?: boolean;
}
