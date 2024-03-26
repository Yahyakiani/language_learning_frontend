import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD2DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './screens/HomeScreen';
import RecordScreen from './screens/RecordScreen';
import ResultsScreen from './screens/ResultScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <PaperProvider theme={MD2DarkTheme}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: '#e91e63',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Record"
            component={RecordScreen}
            options={{
              tabBarLabel: 'Record',
              tabBarIcon: ({ color, size }) => (
                <Icon name="microphone" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              tabBarLabel: 'Results',
              tabBarIcon: ({ color, size }) => (
                <Icon name="chart-bar" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
