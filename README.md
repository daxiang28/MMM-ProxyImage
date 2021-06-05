# MMM-ProxyImage
- Load basic auth security camera images into your Magic Mirror.
- Adds an Express endpoint that the DOM renderer uses as an image source.
- Supports multiple image sources that can be "carousel" cycled.
- Bypasses the deprecation of [embedded credentials in subresource requests](https://www.chromestatus.com/feature/5669008342777856) where basic auth credentials are ignored in asset requests.

## Screenshot
![image](https://user-images.githubusercontent.com/260903/120546523-d7f2d280-c3a4-11eb-8bfc-16b1e166c627.png)
Photo credits: 
[Mikkel Bech](https://unsplash.com/photos/yjAFnkLtKY0), [Brian Babb](https://unsplash.com/photos/XbwHrt87mQ0), [Parker Coffman](https://unsplash.com/photos/zxsdh3DnMrU)

## Installation
```shell
cd ~/MagicMirror/modules/
git clone https://github.com/daxiang28/MMM-ProxyImage

cd ~/MagicMirror/modules/MMM-ProxyImage
npm install
```

## Configuration
```javascript
{
  module: "MMM-ProxyImage",
  position: "top_left",
  config: {
    name: 'FrontDoor', // Must be unique if using multiple instances
    updateInterval : 4000, // Duration between image refresh
    slideInterval: 10000, // Optional: Duration of each slide when multiple hosts are provided
    host: 'http://[CAMERA_IP]/[PATH_TO_STATIC_IMAGE]',
    // Alternately, use an array to cycle through sources 
    // Use the `slideInterval` to set the duration of each slide
    // `user` and `pass` configs are ignored if an array is used
    host: ['http://[AUTH_USER]:[AUTH_PASS]@[CAMERA_IP]/[PATH_TO_STATIC_IMAGE]'],
    port: 80,
    height: 400, // Pixel height of the image
    width: 400, // Pixel width of the image
    user: '[USERNAME]', // Ignored if a host array is defined
    pass: '[PASSWORD]' // Ignored if a host array is defined
    authType: 'basic' // basic||digest auth types
  }
}
```

## Credits
This module was heavily influenced by Ulrich Wisser's [MMM-HTMLSnippet](https://github.com/ulrichwisser/MMM-HTMLSnippet) plugin.
