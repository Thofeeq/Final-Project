// React and React native components
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  ScrollView
} from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Button,
  Icon,
  Title
} from "native-base";

// Header
import ScreenHeader from "../Components/ScreenHeader";

// Email API
import email from "react-native-email";

export default class Help extends React.Component {
  
  // Sends email to Stable support
  handleEmail = () => {
    const to = "reportparking@gmail.com";
    email(to, { subject: "Issue With Stable App" }).catch(console.error);
  };

  // Renders FAQ, to be updated as user questions come in
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollview}>
          <Header style={styles.header}>
            <Text
              onPress={() => this.props.navigation.navigate("Home")}
              style={styles.parker}
            >
              STABLE
            </Text>
            <Button
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon style={styles.icon} name="ios-arrow-back" />
            </Button>
          </Header>
          <Content>
            <Text style={styles.title}>Help /FAQ</Text>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>Q: How long can I park here?</Text>
                  <Text style={styles.body}>
                    A: As long as you want! Don't forget to stop the meter when
                    you are done parking.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: I'm experinceing technical issues with Stable?
                  </Text>
                  <Text style={styles.body} onPress={this.handleEmail}>
                    A: Please email our support team.
                  </Text>
                  <Text onPress={this.handleEmail} style={styles.email}>
                    reportparking@gmail.com
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: Is Stable only available in Calgary?
                  </Text>
                  <Text style={styles.body}>
                    A: Stable can be used across North America but most support
                    is currently located in Calgary. As of December 2018 Stable
                    has plans to expand its support to Saskatchewan, Edmonton
                    and Vancouver.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: Is there a desktop version of Stable?
                  </Text>
                  <Text style={styles.body}>
                    A: No, at the moment Stable is only availble through the app
                    on Apple or Android devices.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>Q: How do I park with Stable?</Text>
                  <Text style={styles.body}>
                    A: Stable is a real time App so treat it just like a normal
                    meter spot. We currently cannot reserve spots, using the map
                    view locate a sport with a green pin, make sure the spot can
                    fit your car and press confirm to start your parking
                    session.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: Why are there no spots where I want to park?
                  </Text>
                  <Text style={styles.body}>
                    A: Stable relies on people in the community to provide
                    access to there private parking spots. So please tell your
                    friends and community members about our App.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: Can I reserve a parking spot?
                  </Text>
                  <Text style={styles.body}>
                    A: No this feature is currently unavailable, but with Peter
                    Parker having such low prices you can book a spot and start
                    paying before you arrive.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: Is there a minimum amount of time to book a parking spot?
                  </Text>
                  <Text style={styles.body}>
                    A: There is no minimum time to park however, there is a
                    minimum 50¢ charge.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text style={styles.body}>
                    Q: Can I report bad behaviour?
                  </Text>
                  <Text style={styles.body} onPress={this.handleEmail}>
                    A: Yes you can report any user by emailing our support team
                  </Text>
                  <Text onPress={this.handleEmail} style={styles.email}>
                    reportparking@gmail.com
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem style={styles.card}>
                <Body>
                  <Text
                    style={styles.body}
                    onPress={() => this.props.navigation.navigate("Home")}
                  >
                    Back to Home
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </ScrollView>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
    color: "white"
  },
  header: {
    height: 75,
    backgroundColor: "#3c3c3c",
    fontFamily: "sans-serif-thin"
  },
  button: {
    position: "absolute",
    left: 0,
    marginTop: 20,
    paddingBottom: 20,
    paddingTop: 0,
    backgroundColor: "#3c3c3c"
  },
  parker: {
    color: "white",
    fontSize: 25,
    letterSpacing: 1,
    marginTop: 20,
    fontFamily: "sans-serif-thin"
  },
  icon: {
    marginTop: 20
  },
  email: {
    color: "#3366BB"
  },
  card: {
    backgroundColor: "#8a8a8a"
  },
  body: {
    color: "#FFFFFF",
    fontFamily: "sans-serif-thin"
  },
  container: {
    flex: 1,
    backgroundColor: "#2f2f2f"
  },
  scrollview: {
    flex: 1
  }
});
