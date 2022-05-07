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

![display-feed-card-demo](https://user-images.githubusercontent.com/73759882/167272332-9cd20de2-3253-4afa-a480-e9bc2147f5c8.gif)

## Context

- `Display-Feed-Card` requires a carefully constructed entity with a very specific format from your Home Assistant instance to display feed entries on your dashboard, otherwise it will not work as expected.
- The entity you choose must have an `attribute` called `values`, which must be an array of objects in the form of:

```JSON
{
    id: "some-unique-string" ,
    name: "My Sweet Project" ,
    creator: "John Doe" ,
    image: "some-image-to-project" ,
    url: "some-link-to-project" ,
    favico: "some-image-to-original-site" ,
}
```

or i.e.

```JSON
attributes: {
    values: [
        {
            id: "some-unique-string" ,
            name: "My Sweet Project" ,
            creator: "John Doe" ,
            image: "some-image-to-project" ,
            url: "some-link-to-project" ,
            favico: "some-image-to-original-site" ,
        },
        {
            id: "another-unique-string" ,
            name: "My Awesome Project" ,
            creator: "Jane Doe" ,
            image: "another-image-to-project" ,
            url: "another-link-to-project" ,
            favico: "another-image-to-original-site" ,
        }
    ]
}
```

- The best way I've discovered to do this so far is by using the Home Assistant [Node Red](https://github.com/hassio-addons/addon-node-red) add-on to facilitate the creation of the entity for the display-feed-card. I've attached a template below as a starting point for anyone interested in creating their own custom feed.
- At the end of the day, as long as you have an entity in your Home Assistant that matches the above template, you should have a feed going.

## Setup

1. Go to the [`display-feed-card` release page](https://github.com/appdevelopmentandsuch/display-feed-card/releases), download `display-feed-card.js`, `display-feed-card-[some_hash].js`, and `editor-[another_hash].js` and upload them to `<config>/www/` on your Home Assistant instance.
2. In your Home Assistant instance, go to `Configuration -> Dashboards -> Resources` and add the following resource: `/local/display-feed-card.js`
3. Restart your Home Assistant Server.
4. Go to a Dashboard and add a `Display-Feed Card`.
5. Set the required information and enjoy!

## Options

| Name           | Type    | Requirement  | Description                                                          | Default | Example                    |
| -------------- | ------- | ------------ | -------------------------------------------------------------------- | ------- | -------------------------- |
| type           | string  | **Required** | The type of card to be declared in Home Assistant                    |         | `custom:display-feed-card` |
| entity         | string  | **Required** | The entity in your Home Assistant instance the feeds are coming from |         | `sensor.display_feed`      |
| shuffle        | boolean | **Optional** | Shuffle the start order of the cards                                 | `false` |                            |
| timer_interval | number  | **Optional** | Duration in seconds between cycling through cards                    | `10`    | `5`                        |

## Node Red Example

### NOTE

To use the Thingiverse API you must provide your own token, otherwise the Thingiverse section of the flow will not work. If you are unable to provide your own token, remove the link between the `Map Thingiverse Output` and `Join Outputs`, additionally modifying the `Join Outputs` node by setting `After a number of message parts` to `1`, otherwise the flow will never finish.

```JSON
[{"id":"e05d1f8e42ad0c57","type":"tab","label":"Thingiverse Popular","disabled":false,"info":"","env":[]},{"id":"51999f2dee7f5872","type":"http request","z":"e05d1f8e42ad0c57","name":"Thingiverse Popular","method":"GET","ret":"obj","paytoqs":"ignore","url":"https://api.thingiverse.com/search?sort=popular&access_token=[insert-your-token-here]","tls":"","persist":false,"proxy":"","authType":"","senderr":false,"x":380,"y":540,"wires":[["01986f5b79afc3ca"]]},{"id":"0c1ae426334daab2","type":"inject","z":"e05d1f8e42ad0c57","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":170,"y":440,"wires":[["51999f2dee7f5872","a5b3e479350fb75e"]]},{"id":"01986f5b79afc3ca","type":"function","z":"e05d1f8e42ad0c57","name":"Map Thingiverse Output","func":"const output = { \n    payload: msg.payload.hits.map(\n        hit => ({\n            id: hit.id,\n            name: hit.name,\n            creator: hit.creator.name,\n            image: hit.thumbnail,\n            url: hit.public_url,\n            favico: \"https://thingiverse.com/favicon.ico\"\n        })\n    )\n};\n\nreturn output;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":810,"y":540,"wires":[["375cd9ce7f7cdf85"]]},{"id":"f6aef638ed364f11","type":"xml","z":"e05d1f8e42ad0c57","name":"Format Adafruit Feed","property":"payload","attr":"","chr":"","x":600,"y":220,"wires":[["272113f58edd5d24"]]},{"id":"a5b3e479350fb75e","type":"http request","z":"e05d1f8e42ad0c57","name":"Adafruit Learn","method":"GET","ret":"txt","paytoqs":"ignore","url":"https://learn.adafruit.com/feed","tls":"","persist":false,"proxy":"","authType":"","senderr":false,"x":340,"y":220,"wires":[["f6aef638ed364f11"]]},{"id":"1fe8d8a9555ca7f4","type":"ha-api","z":"e05d1f8e42ad0c57","name":"Create / Update Entity","server":"c7582449.270ae8","version":1,"debugenabled":false,"protocol":"http","method":"post","path":"/api/states/sensor.display_feed","data":"{ \"state\": \"OK\", \"attributes\": { \"values\": payload }}","dataType":"jsonata","responseType":"json","outputProperties":[{"property":"payload","propertyType":"msg","value":"","valueType":"results"}],"x":1500,"y":400,"wires":[[]]},{"id":"272113f58edd5d24","type":"function","z":"e05d1f8e42ad0c57","name":"Map Adafruit Output","func":"const getImgSrc = (content) => {\n    const src = content.split(\"img src='\")[1]\n    return src.substring(0, src.indexOf(\"'\"))\n}\n\nconst output = {\n    payload: msg.payload.feed.entry.map(\n        entry => ({\n            id: entry.id[0],\n            name: entry.title[0],\n            creator: entry.author[0].name[0],\n            image: getImgSrc(entry.content[0]._),\n            url: entry.url[0],\n            favico: \"https://adafruit.com/favicon.ico\"\n        }))\n}\nreturn output;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":880,"y":220,"wires":[["375cd9ce7f7cdf85"]]},{"id":"375cd9ce7f7cdf85","type":"join","z":"e05d1f8e42ad0c57","name":"Join Outputs","mode":"custom","build":"array","property":"payload","propertyType":"msg","key":"topic","joiner":"\\n","joinerType":"str","accumulate":false,"timeout":"","count":"2","reduceRight":false,"reduceExp":"","reduceInit":"","reduceInitType":"num","reduceFixup":"","x":1090,"y":400,"wires":[["3b7342e9c56408a7"]]},{"id":"3b7342e9c56408a7","type":"function","z":"e05d1f8e42ad0c57","name":"Flatten Outputs","func":"const output = { payload: msg.payload.flat()}\nreturn output;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1280,"y":400,"wires":[["1fe8d8a9555ca7f4"]]},{"id":"c7582449.270ae8","type":"server","name":"Home Assistant","version":2,"addon":true,"rejectUnauthorizedCerts":true,"ha_boolean":"y|yes|true|on|home|open","connectionDelay":false,"cacheJson":true,"heartbeat":false,"heartbeatInterval":"30"}]
```
