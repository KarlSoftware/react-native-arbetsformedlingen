import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Linking } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { MapView } from 'expo';

class ReviewScreen extends Component {
  static propTypes = {
    likedJobs: React.PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Sparade jobb',
    tabBarLabel: 'Sparade',
    headerRight: (
      <Button
        title="Radera"
        onPress={() => navigation.navigate('settings')}
        backgroundColor="rgba(0,0,0,0)"
        color="rgba(0,122,255,1)"
      />
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="favorite" size={30} color={tintColor} />
    ),
  })

  renderLikedJobs() {
    return this.props.likedJobs.map((job) => {
      const initialRegion = {
        longitude: job.coords.lng,
        latitude: job.coords.lat,
        longitudeDelta: 0.045,
        latitudeDelta: 0.02,
      };

      function formatDate(date) {
        return new Date(date).toLocaleDateString().replace(/\//g, '-');
      }

      return (
        <Card containerStyle={{ borderRadius: 10 }} key={job.annons.annonsid}>
          <View style={{ height: 200 }}>
            <MapView
              scrollEnabled={false}
              style={{ flex: 1 }}
              initialRegion={initialRegion}
            />
            <View style={styles.detailWrapper}>
              <Text style={styles.italics}>{job.arbetsplats.arbetsplatsnamn}</Text>
              <Text style={styles.italics}>{formatDate(job.annons.publiceraddatum)}</Text>
            </View>
            <Text style={{ fontWeight: 'bold', marginBottom: 15 }}>{job.annons.annonsrubrik}</Text>
            <Button
              title="Ansök nu!"
              backgroundColor="#006999"
              onPress={() => Linking.openURL(job.ansokan.webbplats)}
            />
          </View>
        </Card>
      );
    });
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#13769d' }}>
        {this.renderLikedJobs()}
      </ScrollView>
    );
  }
}

const styles = {
  detailWrapper: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  italics: {
    fontStyle: 'italic',
  },
};

function mapStateToProps(state) {
  return { likedJobs: state.likedJobs };
}

export default connect(mapStateToProps)(ReviewScreen);
