import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { MapView } from 'expo';
import { Card, Button, Icon } from 'react-native-elements';
import Swipe from '../components/Swipe';
import * as actions from '../actions';

class DeckScreen extends Component {
  static propTypes = {
    navigation: React.PropTypes.shape({
      navigate: React.PropTypes.func.isRequired,
    }).isRequired,
    jobs: React.PropTypes.arrayOf(PropTypes.object).isRequired,
    likeJob: React.PropTypes.func.isRequired,
  }

  static navigationOptions = () => ({
    headerTitle: 'Sökresultat',
    tabBarLabel: 'Sökresultat',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="description" size={30} color={tintColor} />
    ),
  });

  renderCard = (job) => {
    const initialRegion = {
      longitude: job.coords.lng,
      latitude: job.coords.lat,
      longitudeDelta: 0.045,
      latitudeDelta: 0.02,
    };

    function truncateString(str, num) {
      return str.length > num ?
        `${str.slice(0, num > 3 ? num - 3 : num)}...` :
        str;
    }

    function formatDate(date) {
      return new Date(date).toLocaleDateString().replace(/\//g, '-');
    }

    return (
      <Card containerStyle={{ borderRadius: 10, height: 425 }}>
        <View style={{ height: 200 }}>
          <MapView
            scrollEnabled={false}
            style={{ flex: 1 }}
            initialRegion={initialRegion}
          />
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.italics}>{job.arbetsplats.arbetsplatsnamn}</Text>
          <Text style={styles.italics} >{formatDate(job.annons.publiceraddatum)}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{job.annons.annonsrubrik}</Text>
          <View>
            <Text style={{ marginBottom: 5 }}>
              {truncateString(job.annons.annonstext.replace(/\n/g, ''), 220)}
            </Text>
            <Text style={{ fontStyle: 'italic' }}>Sista ansökningsdatum: {formatDate(job.ansokan.sista_ansokningsdag)}</Text>
          </View>
        </View>
      </Card>
    );
  }

  renderNoMoreCards = () => (
    <Card title="Inga jobb hittades">
      <Button
        title="Tillbaka till kartan"
        large
        icon={{ name: 'my-location' }}
        backgroundColor="#006999"
        onPress={() => this.props.navigation.navigate('map')}
      />
    </Card>
  );


  render() {
    return (
      <View style={{ backgroundColor: '#13769d', flex: 1 }}>
        <Swipe
          data={this.props.jobs}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
          onSwipeRight={job => this.props.likeJob(job)}
          keyProp="jobkey"
        />
      </View>
    );
  }
}

const styles = {
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  italics: {
    fontStyle: 'italic',
  },
};

function mapStateToProps({ jobs }) {
  return { jobs: jobs.results };
}

export default connect(mapStateToProps, actions)(DeckScreen);
