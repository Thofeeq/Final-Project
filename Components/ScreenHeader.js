// React and react native components
import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Icon, Button, Container, Header, Content, Left } from "native-base";

// Main app header
export default class ScreenHeader extends Component {
  render() {
    return (
      <Header style={styles.header}>
        <Text
          onPress={() => this.props.navigation.navigate("Home")}
          style={styles.title}
        >
          STABLE
        </Text>
        <Button
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Dashboard")}
        >
          <Icon style={styles.icon} name="ios-arrow-back" />
        </Button>
      </Header>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  header: {
    height: 75,
    backgroundColor: "#2f2f2f"
  },
  button: {
    position: "absolute",
    left: 0,
    marginTop: 20,
    paddingBottom: 20,
    paddingTop: 0,
    backgroundColor: "#2f2f2f"
  },
  title: {
    color: "white",
    fontSize: 25,
    letterSpacing: 1,
    marginTop: 20,
    fontFamily: "sans-serif-thin"
  },
  icon: {
    marginTop: 20
  }
});
