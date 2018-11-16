import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground
} from "react-native";
import { LoggedOutApp, MyApp } from "./config/router.js";
import { BlurView } from "expo";

import firebase from "firebase";

// Development mode only, hides state errors
console.ignoredYellowBox = ["Setting a timer"];
console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      userObject: null,
      loading: true
    };
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  _isMounted = false;

  // Authenticate user
  authenticate(userObject) {
    if (this._isMounted) {
      this.setState({
        currentUser: firebase.auth().currentUser,
        userObject: userObject,
        loading: false
      });
    }
  }

  // Logout user
  logout() {
    if (this._isMounted) {
      firebase
        .auth()
        .signOut()
        .then(
          () => {
            console.log("Signed out");
          },
          () => {}
        );
      this.setState({
        currentUser: null,
        loading: false
      });
    }
  }

  // Checks if user is logged in
  isLoggedIn() {
    let userEmail = firebase.auth().currentUser.email;
    firebase
      .database()
      .ref("users")
      .on(
        "value",
        data => {
          for (let keys in data.val()) {
            if (userEmail === data.val()[keys].email) {
              userObject = data.val()[keys];
              this.authenticate(userObject);
            }
          }
        },
        () => {}
      );
  }

  componentDidMount() {
    this._isMounted = true;
    // Call this function when app mounts
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // currentUser should be non null.
        this.isLoggedIn();
      } else {
        // no user logged in. currentUser is null.
        console.log("yeah you definitely logged out");
        this.setState({ currentUser: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    // TODO: fix setState warnings
    // Warning fix attempt
    this._isMounted = false;
  }

  // Renders loading screen while login info is fetched. 
  // Renders either Logged in version of app or logged out, depending on user auth status.
  render() {
    console.log("Rendering main");

    return (
      <View>
        {!this.state.loading ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              marginTop: 24,
              paddingBottom: 48
            }}
          >
            {firebase.auth().currentUser ? (
              <MyApp
                screenProps={{
                  logout: this.logout,
                  userObject: this.state.userObject
                }}
              />
            ) : (
              <LoggedOutApp screenProps={this.authenticate} />
            )}
          </View>
        ) : (
          <View style={styles.loadingView}>
            <ImageBackground
              resizeMode="cover"
              style={{ height: "100%" }}
              source={require("./assets/parkparkblur.jpg")}
            >
              <BlurView tint="dark" intensity={90} style={styles.opacityView}>
                <View style={styles.info}>
                  <Text style={styles.text}>STABLE</Text>
                  <ActivityIndicator
                    size="large"
                    color="white"
                    style={styles.spinner}
                  />
                </View>
              </BlurView>
            </ImageBackground>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingView: {
    width: "100%",
    height: "100%"
  },
  opacityView: {
    width: "100%",
    height: "100%",
    paddingTop: 360
  },
  info: {
    backgroundColor: "rgba(38, 50, 56, 0.6)",
    display: "flex",
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 36,
    fontFamily: "sans-serif-thin"
  },
  spinner: {
    marginTop: 20,
    marginBottom: 20
  }
});
