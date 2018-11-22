'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import {
  ViroScene,
  ViroText,
  Viro360Image,
  ViroBox,
  ViroMaterials
} from 'react-viro';

export default class HelloWorldScene extends Component {

  constructor() {
    super();

    this.state = {
      imgSource: null,
      material: null
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

        if(this.state.material)
          ViroMaterials.deleteMaterials([this.state.material]);

        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        let back_source = source;

        let materialName = ''+ (+new Date())

        ViroMaterials.createMaterials({
          [materialName]: {
            diffuseTexture: back_source,
          },
        });

        this.setState({
          imgSource: source,
          material: materialName
        });

      }
    });
  }

  render() {
    let back_source = require('./res/guadalupe_360.jpg');

    let material = this.state.material  ||  'grid';
    return (
      <ViroScene>
        <Viro360Image source={back_source} />
        <ViroText text="Change Image" 
          width={2} height={2} 
          position={[0, 0, -2]} 
          style={styles.helloWorldTextStyle}
          onClick={() => {
            this.changeImage();
          }} />
          <ViroBox position={[0, -2, -2]} scale={[2,2,0]} materials={[material]} /> 
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


ViroMaterials.createMaterials({
  grid: {
   diffuseTexture: require('./res/ico_wait.png'),
  },
});


module.exports = HelloWorldScene;
