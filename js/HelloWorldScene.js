'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import {
  ViroScene,
  ViroText,
  Viro360Image,
  ViroBox,
  ViroMaterials,
  ViroVideo,
  ViroNode,
  ViroImage,
  ViroButton,
  ViroAnimations
} from 'react-viro';


var VIDEO_REF = "videoref";
var videos = [
  {uri:'https://s3-us-west-2.amazonaws.com/viro/Assets/Viro_Media_Video.mp4'},
  {uri:'https://s3-us-west-2.amazonaws.com/viro/Assets/ProductVideo.mp4'},
];
var buttonSize = 0.25;
var VideoControlRef = "VideoControlRef";


export default class HelloWorldScene extends Component {

  constructor() {
    super();

    this.state = {
      imgSource: null,
      material: null,

      vdeo: null,
      videoPaused: false,
      loopVideo: true,
      videoIndex: 0,
      videoCurrentSeek: 0,
      videoTotalSeek: 0
    }

    this.changeImage = this.changeImage.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this._togglePauseVideo = this._togglePauseVideo.bind(this);
    this.videoForward = this.videoForward.bind(this);
    this.videoBackward =  this.videoBackward.bind(this);
    this._onUpdateTime = this._onUpdateTime.bind(this);

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

  changeVideo() {

    console.log("Change Video");

    ImagePicker.showImagePicker({
      mediaType: 'video'
    }, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('VideoPicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({
          video: source
        });

      }
    });
  }

  _togglePauseVideo() {
    this.setState({
      videoPaused: !this.state.videoPaused,
    })
  }

  _onUpdateTime(current, total) {
    this.setState({
      videoCurrentSeek: current, 
      videoTotalSeek: total
    })
  }

  videoForward() {
    this.refs.videoref.seekToTime(this.state.videoCurrentSeek + 10);
  }

  videoBackward() {
    this.refs.videoref.seekToTime(this.state.videoCurrentSeek - 10);
  }

  render() {
    let back_source = require('./res/guadalupe_360.jpg');

    let material = this.state.material  ||  'grid';
    let videoSrc = this.state.video || videos[0];
    return (
      <ViroScene>
        <Viro360Image source={back_source} />
        <ViroText text="Change Image" 
          width={2} height={2} 
          position={[-2, 0, 0]} 
          rotation={[0, 90, 0]}
          style={styles.helloWorldTextStyle}
          onClick={() => {
            this.changeImage();
          }} />
        <ViroBox 
          position={[-2, -2, 0]} 
          rotation={[0, 90, 0]}
          scale={[2,2,0]} 
          materials={[material]} /> 

        <ViroText text="Change Video" 
          width={2} height={2} 
          position={[0, 1.5, -2]} 
          style={styles.helloWorldTextStyle}
          onClick={() => {
            this.changeVideo();
          }} />

        <ViroVideo ref={VIDEO_REF} source={videoSrc} volume={1.0}
          position={[0, -3.9, -45]}
          width={74} height={35}
          onUpdateTime={this._onUpdateTime}
          loop={this.state.loopVideo}
          paused={this.state.videoPaused} />

        {this._renderVideoControl()}

      </ViroScene>
    );
  }


  _renderVideoControl(){
    return(
        <ViroNode position={[0,-1.4,0]} opacity={1.0} >
          <ViroImage
            scale={[1.4, .6, 1]}
            position={[0, -0.27,-2.1]}
            source={require("./res/player_controls_container.png")} />

          <ViroButton
            position={[-buttonSize-0.1,-0.2,-2]}
            scale={[1, 1, 1]}
            width={buttonSize}
            height={buttonSize}
            animation={{name: "animationButton", run: true }}
            source={require("./res/previous.png")}
            hoverSource={require("./res/previous_hover.png")}
            clickSource={require("./res/previous_hover.png")}
            onClick={()=>{this.videoBackward(); }} />

          {this._renderPlayControl()}

          <ViroButton
            position={[buttonSize+0.1, -0.2,-2]}
            scale={[1, 1, 1]}
            width={buttonSize}
            height={buttonSize}
            animation={{name: "animationButton", run: true }}
            source={require("./res/skip.png")}
            hoverSource={require("./res/skip_hover.png")}
            clickSource={require("./res/skip_hover.png")}
            onClick={()=>{this.videoForward(); }} />

          <ViroText text={''+this.state.videoCurrentSeek}
            style={styles.seekTimeStyle}
            position={[2*buttonSize - 0.1, 0.45, -1]} />

          <ViroText text="/"
            style={styles.seekTimeStyle}
            position={[2*buttonSize, 0.45, -1]} />

          <ViroText text={''+parseInt(this.state.videoTotalSeek)}
            style={styles.seekTimeStyle}
            position={[2*buttonSize + 0.1, 0.45, -1]} />

        </ViroNode>
    );
  }

  /**
   * Renders either the play or pause icon depending on video state.
   */
  _renderPlayControl(){
    if (this.state.videoPaused){
      return (
          <ViroButton
              position={[0,-0.2,-2]}
              scale={[1, 1, 1]}
              width={buttonSize}
              animation={{name: "animationButton", run: true }}
              height={buttonSize}
              source={require("./res/play.png")}
              hoverSource={require("./res/play_hover.png")}
              clickSource={require("./res/play_hover.png")}
              onClick={this._togglePauseVideo}/>
      );
    } else {
      return (
          <ViroButton
              position={[0,-0.2,-2]}
              scale={[1, 1, 1]}
              width={buttonSize}
              animation={{name: "animationButton", run: true }}
              height={buttonSize}
              source={require("./res/pause.png")}
              hoverSource={require("./res/pause_hover.png")}
              clickSource={require("./res/pause_hover.png")}
              onClick={this._togglePauseVideo}/>
      );
    }
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
  seekTimeStyle: {
    color: '#777',
    fontSize: 12
  }
});


ViroAnimations.registerAnimations({
  animationButton: {
    properties: {
      opacity: 0.8
    },
    easing: "Bounce",
    duration: 500
  }
})

ViroMaterials.createMaterials({
  grid: {
   diffuseTexture: require('./res/ico_wait.png'),
  },
});


module.exports = HelloWorldScene;
