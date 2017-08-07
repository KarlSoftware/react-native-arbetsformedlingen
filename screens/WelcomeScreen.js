import _ from 'lodash';
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import Slides from '../components/Slides';

const SLIDE_DATA = [
  { text: 'Välkommen till Arbetsförmedlingens inofficiella app', logo: 'http://vignette4.wikia.nocookie.net/logopedia/images/8/85/Arbetsförmedlingen_symbol.png', color: '#13769d' },
  { text: 'Hjälper dig att finna ett jobb', color: '#006b00' },
  { text: 'Ange plats och börja swipa', color: '#F99F28' },
];

class WelcomeScreen extends Component {
  static propTypes = {
    navigation: React.PropTypes.shape({
      navigate: React.PropTypes.func.isRequired,
    }).isRequired,
  }

  state = { token: null }

  async componentWillMount() {
    const token = await AsyncStorage.getItem('jobs_token');

    if (token) {
      this.setState({ token });
      this.props.navigation.navigate('map');
    } else {
      this.setState({ token: false });
    }
  }

  onSlidesComplete = () => {
    AsyncStorage.setItem('jobs_token', 'initiated');
    this.props.navigation.navigate('map');
  }

  render() {
    if (_.isNull(this.state.token)) {
      return <AppLoading />;
    }

    return (
      <Slides
        data={SLIDE_DATA}
        onComplete={this.onSlidesComplete}
      />
    );
  }
}

export default WelcomeScreen;
