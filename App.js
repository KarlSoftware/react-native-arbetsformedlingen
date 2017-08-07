import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import store from './store';
import WelcomeScreen from './screens/WelcomeScreen';
import DeckScreen from './screens/DeckScreen';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReviewScreen from './screens/ReviewScreen';

const App = () => {
  const MainNavigator = TabNavigator({
    welcome: { screen: WelcomeScreen },
    main: {
      screen: TabNavigator({
        map: { screen: MapScreen },
        deck: { screen: DeckScreen },
        review: {
          screen: StackNavigator({
            review: { screen: ReviewScreen },
            settings: { screen: SettingsScreen },
          }),
        },
      }, {
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        tabBarOptions: {
          labelStyle: { fontSize: 12 },
          activeTintColor: '#ffffff',
          style: {
            backgroundColor: '#006999',
          },
        },
      }),
    },
  }, {
    navigationOptions: {
      tabBarVisible: false,
    },
    lazy: true,
  });

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <MainNavigator />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default App;
