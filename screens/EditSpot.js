// React and React native components
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Container,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";

// Header
import ScreenHeader from "../Components/ScreenHeader";

// Firebase
import firebase from "../Firebase.js";

import { ImagePicker } from "expo";


export default class EditSpot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marker: [],
      address: "",
      picture_url: "",
      user: "",
      description: "",
      price: 0,
      latitude: "",
      longitude: "",
      is_rented: false,
      current_spot: "",
      image: ""
    };

    this.updateSpot = this.updateSpot.bind(this);
    this.getSpot = this.getSpot.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.uploadImageAsync = this.uploadImageAsync.bind(this);
    this.deleteSpot = this.deleteSpot.bind(this);
    this.toggleRented = this.toggleRented.bind(this);
  }

  _isMounted = false;

  // Function which can select new image for parking spot
  pickImage() {
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      console.log(result);

      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    };

    _pickImage();
  }

  // Get spot data from state
  getSpot() {
    let spot = {
      description: this.state.description,
      price: this.state.price
    };
    return spot;
  }

  // Delete parking spot
  deleteSpot() {
    firebase
      .database()
      .ref(`spots/${this.props.navigation.state.params.spot.key}`)
      .remove();
    this.props.navigation.push("MySpots");
  }

  // Allows user to turn spot on/off
  // TODO: show rent status to user
  toggleRented() {
    let bool;
    let spot_bool = firebase
      .database()
      .ref(`spots/${this.props.navigation.state.params.spot.key}/is_rented`);
    spot_bool.on("value", data => {
      bool = data.val();
    });

    if (bool === true) {
      spot_bool.set(false);
    } else {
      spot_bool.set(true);
    }
  }

  // Upload image from image picker to firebase db
  async uploadImageAsync(uri, spot_id) {
    console.log("URI", uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child(`lot_images/${current_spot.owner}/${current_spot.key}/lot.jpg`);
    await ref.put(blob).then(() => {
      console.log("in the async action");
      self.props.navigation.navigate("MySpots");
    });
  }

  // Function to edit spot in Firebase
  updateSpot(spot) {
    const current_spot = this.props.navigation.state.params.spot;

    let the_spot = firebase.database().ref(`spots/${current_spot.key}`);
    // find the spot in database

    the_spot
      .update({
        description: spot.description,
        price: spot.price
      })
      .then(() => {
        //success callback

        this.uploadImageAsync(this.state.image, current_spot.key);

        this.props.navigation.push("MySpots", {
          onNavigateBack: this.receivedUpdate
        });
      })
      .catch(error => {
        //error callback
        console.log("error ", error);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    const spot_id = this.props.navigation.state.params.spot.key;
    let spot = firebase.database().ref(`spots/${spot_id}`);

    // Finds current spot from Firebase
    spot.once("value").then(data => {
      this.setState({
        description: data.val().description,
        price: data.val().price,
        address: data.val().title
      });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Renders form which allows user to edit their spot
  render() {
    return (
      <ScrollView>
        <ScreenHeader navigation={this.props.navigation} />
        <KeyboardAvoidingView behavior="padding" style={styles.body}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Edit Parking Spot</Text>
          </View>
          <Text style={styles.title}>{this.state.address}</Text>
          <View style={styles.content}>
            {this.state.image ? (
              <Image
                style={{
                  alignSelf: "center",
                  width: 128,
                  height: 128,
                  resizeMode: "contain"
                }}
                source={{ uri: this.state.image }}
              />
            ) : (
              <TouchableOpacity onPress={this.pickImage}>
                <Image
                  style={{ alignSelf: "center" }}
                  source={require("../assets/add_image.png")}
                />
              </TouchableOpacity>
            )}
            <TextInput
              underlineColorAndroid="transparent"
              returnKeyType={"next"}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                this.price.focus();
              }}
              ref={input => {
                this.description = input;
              }}
              style={styles.inputField}
              onChangeText={text => this.setState({ description: text })}
              value={this.state.description + ""}
            />
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.inputField}
              ref={input => {
                this.price = input;
              }}
              onChangeText={text => this.setState({ price: text })}
              value={this.state.price + ""}
            />
          </View>
          <Button
            buttonStyle={styles.button}
            onPress={() => this.updateSpot(this.getSpot())}
            title="Save Changes"
            accessibilityLabel="Add a parking spot"
          />
          <Button
            buttonStyle={[styles.button, { marginBottom: 30 }]}
            onPress={() => this.deleteSpot()}
            title="Delete"
            accessibilityLabel="Delete this parking spot"
          />
          <Button
            buttonStyle={styles.button}
            onPress={() => this.toggleRented()}
            title="Toggle On/Off"
            accessibilityLabel="Toggle this parking spot on/off"
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  body: {
    backgroundColor: "#424242",
    height: Dimensions.get("window").height,
    alignItems: "center",
    color: "white"
  },
  inputField: {
    height: 40,
    width: Dimensions.get("window").width * 0.8,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
    padding: 5,
    borderRadius: 15,
    borderColor: "black",
    fontSize: 15,
    alignItems: "flex-start",
    color: "white"
  },
  button: {
    width: 300,
    elevation: 0,
    marginBottom: 50,
    backgroundColor: "#2f2f2f"
  },
  headerContent: {
    padding: 30,
    alignItems: "center"
  },
  map: {
    width: 300,
    height: 300
  },
  title: {
    color: "#FFFFFF"
  }
});
