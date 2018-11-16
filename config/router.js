// React and react native components
import React from "react";
import {
  createDrawerNavigator,
  DrawerItems,
  createStackNavigator
} from "react-navigation";
import { StyleSheet, Image } from "react-native";
import {
  Container,
  Content,
  Header,
  Body,
  Text,
  Icon,
  Root
} from "native-base";

// importing screens/components
import Dashboard from "../screens/Dashboard.js";
import OrderHistory from "../screens/OrderHistory.js";
import MySpots from "../screens/MySpots.js";
import AddASpot from "../screens/AddASpot.js";
import RentHistory from "../screens/RentHistory.js";
import Map from "../screens/Map.js";
import EditProfile from "../screens/EditProfile.js";
import PaymentInfo from "../screens/PaymentInfo.js";
import Help from "../screens/Help.js";
import Login from "../Components/Login.js";
import Register from "../Components/RegisterForm";
import EditSpot from "../screens/EditSpot";
import ForgotPassword from "../Components/ForgotPassword";

// database connection
import firebase from "firebase";
import startFirebase from "./startFirebase";
startFirebase(firebase);

// Root navigator
export const RootStack = createStackNavigator(
  {
    Home: {
      screen: Map
    },
    OrderHistory: {
      screen: OrderHistory
    },
    RentHistory: {
      screen: RentHistory
    },
    MySpots: {
      screen: MySpots
    },
    AddASpot: {
      screen: AddASpot
    },
    EditProfile: {
      screen: EditProfile
    },
    PaymentInfo: {
      screen: PaymentInfo
    },
    EditSpot: {
      screen: EditSpot
    },
    ForgotPassword: {
      screen: ForgotPassword
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

// Drawer Navigator
const CustomDrawerContentComponent = props => (
  <Container>
    <Header style={styles.drawerStyle}>
      <Body style={styles.drawerStyle}>
        <Image
          style={styles.drawerImage}
          source={require("../assets/horse.png")}
        />
        <Text style={styles.welcome}>
          Welcome {props.screenProps.userObject.first_name}.
        </Text>
      </Body>
    </Header>
    <Content style={styles.content}>
      <DrawerItems activeBackgroundColor='#212121' inactiveTintColor='rgba(0, 0, 0, .87)' labelStyle={styles.drawerItems}
        {...props}
        onItemPress={(route, focused) => {
          props.onItemPress({ route, focused });
          //If the presses item is Logout, call the props
          if (route.route.key === "Logout") {
            props.screenProps.logout();
          } else if (route.route.key === "Map") {
            props.navigation.navigate("Home");
          } else if (route.route.key === "Dashboard") {
            props.navigation.navigate("Dashboard");
          } else if (route.route.key === "Help") {
            props.navigation.navigate("Help");
          }
        }}
      />
    </Content>
  </Container>
);

// Logged out Drawer navigator
const CustomDrawerContentComponentLoggedOut = props => (
  <Container>
    <Header style={styles.drawerStyle}>
      <Body style={styles.drawerStyle}>
        <Image
          style={styles.drawerImage}
          source={require("../assets/horse.png")}
        />
      </Body>
    </Header>
    <Content style={styles.content}>
      <DrawerItems activeBackgroundColor='#212121' inactiveTintColor='rgba(0, 0, 0, .87)' labelStyle={styles.drawerItems} {...props} />
    </Content>
  </Container>
);

// Main app 
export const MyApp = createDrawerNavigator(
  {
    Map: {
      screen: RootStack
    },
    Dashboard: {
      screen: props => (
        <Dashboard {...props} user={props.screenProps.userObject} />
      )
    },
    Logout: {
      screen: RootStack
    },
    Help: {
      screen: Help
    }
  },
  {
    InitalRouteName: "Home",
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

// Logged out app
export const LoggedOutApp = createDrawerNavigator(
  {
    Home: {
      screen: RootStack
    },
    Login: {
      screen: props => <Login {...props} authenticate={props.screenProps} />
    },
    Register: {
      screen: Register
    },
    Help: {
      screen: Help
    }
  },
  {
    InitalRouteName: "Home",
    contentComponent: CustomDrawerContentComponentLoggedOut,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

// Styles
const styles = StyleSheet.create({
  drawerImage: {
    height: 150,
    width: 150,
    marginLeft: 50,
    marginTop: 24,
    backgroundColor: '#3c3c3c'
  },
  drawerStyle: {
    height: 200,
    backgroundColor: '#3c3c3c'
  },
  content: {
    backgroundColor: '#3c3c3c',
  },
  drawerItems: {
    color: '#F5F5F5',
    fontWeight: '100',
    fontFamily: 'sans-serif-thin'
  },
  welcome: { 
    alignSelf: "center",
    marginTop: 5,
    color: '#F5F5F5',
    fontWeight: '100',
    fontFamily: 'sans-serif-thin'
  }
});
