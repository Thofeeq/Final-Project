// React and react native components
import React from "react";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Body
} from "native-base";
import {
  Image,
  StyleSheet,
  Button,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
import ScreenHeader from "../Components/ScreenHeader";

// Firebase
import firebase from "../Firebase.js";
const baseUrl =
  "https://firebasestorage.googleapis.com/v0/b/parker-7a5ba.appspot.com/o/lot_images%2F";
const endUrl = "%2Flot.jpg?alt=media";

export default class MySpots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spots: [],
      renderedSpots: [],
      image_url: null
    };
    firebase;
    storageRef = firebase.storage().ref();
    this.urlToFetch = null;
    this.counter = 0;
    this.receivedUpdate = this.receivedUpdate.bind(this);
  }

  // TODO: Render changes when spot is rented.
  receivedUpdate = foo => {
    console.log("in the received update");
    this.setState({ foo });
  };

  // Finds current users spots in firebase
  componentDidMount() {
    let user_id = firebase.auth().currentUser.uid;

    firebase
      .database()
      .ref("/spots/")
      .on("value", data => {
        let spots = [];
        data.forEach(spot => {
          if (user_id === spot.val().owner) {
            let newSpot = spot.val();
            newSpot.key = spot.key;
            spots.push(newSpot);
          }
        });
        // Adds spots to state
        this.setState({ spots: spots });
      });
  }

  componentWillUnmount() {
    // firebase.database().ref.off();
  }

  // Renders card for each spot that a user has created
  render() {
    self = this;
    let id = 0;
    let mySpots = this.state.spots.map(spot => {
      if (spot.picture_url) {
        self.urlToFetch = `${baseUrl}${firebase.auth().currentUser.uid}%2F${
          spot.key
        }${endUrl}`;
      } else {
        self.urlToFetch =
          "https://firebasestorage.googleapis.com/v0/b/parker-7a5ba.appspot.com/o/no_imagev2.png?alt=media&token=dc6603f8-58df-41c8-8f89-3e9a01dfb280";
      }
      id++;
      return (
        <Card key={spot.key}>
          <CardItem
            header
            bordered
            style={styles.card}
            containerStyle={{ flexDirection: "row" }}
          >
            <Text style={styles.header}>Spot: {id}</Text>
            {spot.is_rented ? (
              <Image
                source={require("../assets/red_light.png")}
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: Dimensions.get("window").width * 0.65
                }}
              />
            ) : (
              <Image
                source={require("../assets/green_light.png")}
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: Dimensions.get("window").width * 0.65
                }}
              />
            )}
          
          </CardItem>
          <CardItem style={styles.card} bordered>
            <Image style={styles.picture} source={{ uri: self.urlToFetch }} />
          </CardItem>
          <CardItem style={styles.card} bordered>
            <Body>
              <Text style={styles.body}>
                Address: {spot.title}
                {"\n"}
                Description: {spot.description}
              </Text>
            </Body>
          </CardItem>
          <CardItem style={styles.card} footer bordered>
            <Text style={styles.body}>
              Price: ${spot.price}
              /hr
            </Text>
          </CardItem>

          <Button
            // style={styles.button}
            disabled={spot.is_rented}
            onPress={() =>
              self.props.navigation.navigate("EditSpot", {
                spot,
                onNavigateBack: this.receivedUpdate
              })
            }
            title="Edit Spot"
            color="#2f2f2f"
            accessibilityLabel="Edit Parking Spot"
          />
        </Card>
      );
    });
    //end of mapping

    return (
      <Container style={styles.container}>
        <ScreenHeader navigation={this.props.navigation} />
        <Content padder>{mySpots}</Content>
      </Container>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  picture: {
    flexDirection: "column",
    width: 128,
    height: 128,
    justifyContent: "flex-end"
  },
  container: {
    backgroundColor: "#3c3c3c"
  },
  card: {
    backgroundColor: "#2f2f2f"
  },
  header: {
    color: "white",
    fontFamily: "sans-serif-thin"
  },
  body: {
    color: "#FFFFFF",
    fontFamily: "sans-serif-thin"
  },
  button: {
    color: "#8a8a8a",
    fontFamily: "sans-serif-thin"
  }
});
