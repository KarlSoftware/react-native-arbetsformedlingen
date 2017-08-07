import React, { Component } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { MapView, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import * as actions from '../actions';

class MapScreen extends Component {
  static propTypes = {
    navigation: React.PropTypes.shape({
      navigate: React.PropTypes.func.isRequired,
    }).isRequired,
    fetchJobs: React.PropTypes.func.isRequired,
  }

  static navigationOptions = () => ({
    tabBarLabel: 'Karta',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="my-location" size={30} color={tintColor} />
    ),
  });

  state = {
    mapLoaded: false,
    region: {
      longitude: 0,
      latitude: 0,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09,
    },
    searchterm: '',
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getLocationAsync();
    }
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  }

  onButtonPress = () => {
    const { region, searchterm } = this.state;
    this.props.fetchJobs(region, searchterm, () => {
      this.props.navigation.navigate('deck');
    });
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    this.setState({
      region: {
        latitude,
        longitude,
        latitudeDelta: this.state.latitudeDelta,
        longitudeDelta: this.state.longitudeDelta,
      },
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={{ flex: 1 }}
        />

        <TextInput
          style={styles.textInputContainer}
          autoCorrect={false}
          placeholder="Sökterm"
          onChangeText={searchterm => this.setState({ searchterm })}
          value={this.state.searchterm}
        />

        <View style={styles.buttonContainer}>
          <Button
            large
            title="Sök i det här området"
            backgroundColor="#006999"
            icon={{ name: 'search' }}
            onPress={this.onButtonPress}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  textInputContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 50,
    margin: 20,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    boxShadow: '5pt 5pt 5pt 0pt rgba(0,0,0,0.75)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
};

export default connect(null, actions)(MapScreen);
