import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { clearLikedJobs } from '../actions';

class SettingsScreen extends Component {
  static propTypes = {
    clearLikedJobs: React.PropTypes.func.isRequired,
  }
  static navigationOptions = {
    tabBarLabel: 'Inställningar',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="settings" size={30} color={tintColor} />
    ),
  }
  render() {
    return (
      <View>
        <Button
          title="Radera sparade jobb"
          large
          icon={{ name: 'delete-forever' }}
          backgroundColor="#F44336"
          onPress={this.props.clearLikedJobs}
        />
      </View>
    );
  }
}

export default connect(null, { clearLikedJobs })(SettingsScreen);
