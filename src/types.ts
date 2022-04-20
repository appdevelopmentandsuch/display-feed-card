import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'project-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export interface APIThingiverseResponse {
  total: number;
  hits: Array<ThingiverseResponse>;
}

export interface ThingiverseResponse {
  id: number;
  name: string;
  url: string;
  public_url: string;
  created_at: string;
  thumbnail: string;
  preview_image: string;
  creator: Creator;
  is_private: number;
  is_purchased: number;
  is_published: number;
  comment_count: number;
  make_count: number;
  like_count: number;
  tags?: TagsEntity[] | null;
  is_nsfw?: null;
}
export interface Creator {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  url: string;
  public_url: string;
  thumbnail: string;
  count_of_followers: number;
  count_of_following: number;
  count_of_designs: number;
  accepts_tips: boolean;
  is_following: boolean;
  location: string;
  cover: string;
}
export interface TagsEntity {
  name: string;
  tag: string;
  url: string;
  count: number;
  things_url: string;
  absolute_url: string;
}

export interface ProjectCardConfig extends LovelaceCardConfig {
  type: string;
  test_gui?: boolean;
  endpoints: string;
  api_key: string;
  shuffle?: boolean;
  timer_interval?: number;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
