# MMM-ProxyImage
- Load basic auth security camera images into your Magic Mirror.
- Adds an Express endpoint that the DOM renderer uses as an image source.
- Bypasses the deprecation of [embedded credentials in subresource requests](https://www.chromestatus.com/feature/5669008342777856) where basic auth credentials are ignored in asset requests.

## Screenshot
![image](https://user-images.githubusercontent.com/260903/120546523-d7f2d280-c3a4-11eb-8bfc-16b1e166c627.png)
Photo credits: 
[Mikkel Bech](https://unsplash.com/photos/yjAFnkLtKY0), [Brian Babb](https://unsplash.com/photos/XbwHrt87mQ0), [Parker Coffman](https://unsplash.com/photos/zxsdh3DnMrU)

## Installation
```shell
cd ~/MagicMirror/modules/
git clone https://github.com/daxiang28/MMM-ProxyImage
```

## Configuration
```javascript
{
  module: "MMM-ProxyImage",
  position: "top_left",
  config: {
    name: 'FrontDoor', // Must be unique if using multiple instances
    updateInterval : 4000,
    host: 'http://[CAMERA_IP]/[PATH_TO_STATIC_IMAGE]',
    port: 80,
    height: 400, // Pixel height of the image
    width: 400, // Pixel width of the image
    user: '[USERNAME]',
    pass: '[PASSWORD]'
  }
}
```

## Credits
This module was heavily influenced by Ulrich Wisser's [MMM-HTMLSnippet](https://github.com/ulrichwisser/MMM-HTMLSnippet) plugin.
