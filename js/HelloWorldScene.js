'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import {
  ViroScene,
  ViroText,
  Viro360Image,
  ViroMaterials
} from 'react-viro';

export default class HelloWorldScene extends Component {

  constructor() {
    super();

    this.state = {
      imgSource: null
    }

    this.changeImage = this.changeImage.bind(this);

  }

  changeImage() {

    ImagePicker.showImagePicker({}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imgSource: source,
        });
      }
    });
  }

  render() {
    let back_source = this.state.imgSource || require('./res/guadalupe_360.jpg');
    return (
      <ViroScene>
        <Viro360Image source={back_source} />
        <ViroText text="Hello World!" 
          width={2} height={2} 
          position={[0, 0, -2]} 
          style={styles.helloWorldTextStyle}
          onClick={() => {
            this.changeImage();
          }} />
      </ViroScene>
    );
  }

}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 60,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = HelloWorldScene;
