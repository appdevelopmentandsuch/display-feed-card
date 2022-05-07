# Display-Feed Card by [@appdevelopmentandsuch](https://www.github.com/appdevelopmentandsuch)

[![CodeFactor](https://www.codefactor.io/repository/github/appdevelopmentandsuch/display-feed-card/badge)](https://www.codefactor.io/repository/github/appdevelopmentandsuch/display-feed-card)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/graphs/commit-activity)
[![GitHub license](https://img.shields.io/github/license/appdevelopmentandsuch/display-feed-card.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/release/appdevelopmentandsuch/display-feed-card.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/releases/)
[![GitHub tag](https://img.shields.io/github/tag/appdevelopmentandsuch/display-feed-card.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/tags/)
[![Github all releases](https://img.shields.io/github/downloads/appdevelopmentandsuch/display-feed-card/total.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/releases/)
[![GitHub stars](https://img.shields.io/github/stars/appdevelopmentandsuch/display-feed-card.svg?style=social&label=Star&maxAge=2592000)](https://github.com/appdevelopmentandsuch/display-feed-card/stargazers/)
[![GitHub issues](https://img.shields.io/github/issues/appdevelopmentandsuch/display-feed-card.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/issues/)
[![GitHub issues-closed](https://img.shields.io/github/issues-closed/appdevelopmentandsuch/display-feed-card.svg)](https://github.com/appdevelopmentandsuch/display-feed-card/issues?q=is%3Aissue+is%3Aclosed)

![display-feed-card-demo](https://user-images.githubusercontent.com/73759882/164341651-66160d60-0567-4baf-8722-dc60d423d350.gif)

## Setup

1. Go to the [`display-feed-card` release page](https://github.com/appdevelopmentandsuch/display-feed-card/releases), download `display-feed-card.js`, `display-feed-card-[some_hash].js`, and `editor-[another_hash].js` and upload them to `<config>/www/` on your Home Assistant instance.
2. In your Home Assistant instance, go to `Configuration -> Dashboards -> Resources` and add the following resource: `/local/display-feed-card.js`
3. Restart your Home Assistant Server.
4. Go to a Dashboard and add a `Display-Feed Card`.
5. Set the required information and enjoy!

## Options

| Name           | Type    | Requirement  | Description                                                                                                                                                                                                            | Default | Example                                                                              |
| -------------- | ------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| type           | string  | **Required** | The type of card to be declared in Home Assistant                                                                                                                                                                      |         | `custom:display-feed-card`                                                           |
| shuffle        | boolean | **Optional** | Shuffle the start order of the cards                                                                                                                                                                                   | `false` |                                                                                      |
| api_key        | string  | **Required** | Display-Feed API Key, can be obtained [here](https://www.display-feed.com/login/YToyOntzOjQ6InR5cGUiO3M6ODoicmVkaXJlY3QiO3M6NDoiZGF0YSI7czo0NjoiaHR0cHM6Ly93d3cudGhpbmdpdmVyc2UuY29tL2RldmVsb3BlcnMvbXktYXBwcyI7fQ==). |         | `abcdefghijk1234567890lmnopqrstuvw`                                                  |
| endpoints      | string  | **Required** | Comma separated string of Display-Feed endpoints you want to call                                                                                                                                                      |         | `search?sort=popular,search?is_featured=1`, i.e. Display popular and featured things |
| timer_interval | number  | **Optional** | Duration in seconds between cycling through cards                                                                                                                                                                      | `10`    | `5`                                                                                  |
