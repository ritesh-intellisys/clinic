// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Loginpage from './Frontend/src/Loginpage';
import Home from './Frontend/src/Home';
import Forgotpassword from './Frontend/src/Forgotpassword';
import Signuppage from './Frontend/src/Signuppage';
import Profilepage from './Frontend/src/Profilepage';
import Setting from './Frontend/src/Setting';
import AdminDashboard from './Frontend/src/AdminDashboard';
import Appointments from './Frontend/src/Appointments';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Loginpage} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="forgotpassword" component={Forgotpassword} />
        <Stack.Screen name="signup" component={Signuppage} />
        <Stack.Screen name="profile" component={Profilepage} />
        <Stack.Screen name="setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 