import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Dimensions, Image } from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {
  static propTypes = {
    data: React.PropTypes.arrayOf(PropTypes.object).isRequired,
    onComplete: React.PropTypes.func.isRequired,
  }

  renderLastSlide() {
    return (
      <Button
        title="Gå vidare!"
        raised
        buttonStyle={styles.buttonStyle}
        onPress={this.props.onComplete}
      />
    );
  }

  renderSlides() {
    return this.props.data.map((slide, index) => (
      <View
        key={slide.text}
        style={[styles.slideStyle, { backgroundColor: slide.color }]}
      >
        {slide.logo ? <Image style={{ width: 150, height: 150 }} resizeMode="contain" source={{ uri: slide.logo }} /> : null}
        <Text style={styles.textStyle}>{slide.text}</Text>
        {(index === this.props.data.length - 1) && this.renderLastSlide()}
      </View>
    ));
  }


  render() {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        style={{ flex: 1 }}
      >
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = {
  slideStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  textStyle: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonStyle: {
    backgroundColor: '#D85D5D',
  },
};

export default Slides;
