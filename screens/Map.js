import React, { Component } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import PopupDialog, { SlideAnimation } from "react-native-popup-dialog";
import InfoCard from "../Components/InfoCard";
import ConfirmCard from "../Components/ConfirmCard";
import StatusCard from "../Components/StatusCard";
import CurrentRental from "../Components/CurrentRental";
import HeaderNavigation from "../Components/HeaderNavigation.js";
import { MapAutoComplete } from "react-native-google-places-autocomplete/MapAutoComplete";
import { GOOGLE_MAPS_API } from "react-native-dotenv";

import { Container } from "native-base";

import firebase from "../Firebase.js";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      markers: [],
      parkPressed: false,
      spotInfo: {
        price: 1.25,
        info: ["Plug available", "12345 12 Street"],
        is_rented: null,
        id: null,
        price: null,
        owner: null
      },
      spotRented: null,
      location: { lat: 51.0478, lng: -114.0593 },
      currentOrder: null,
      rentedSpotInfo: {
        price: null,
        info: []
      }
    };
    this.markerPressed = this.markerPressed.bind(this);
    this.parkButtonPressed = this.parkButtonPressed.bind(this);
    this.parkingConfirmComplete = this.parkingConfirmComplete.bind(this);
    this.statusPressed = this.statusPressed.bind(this);
    this.writeOrderData = this.writeOrderData.bind(this);
    this.checkout = this.checkout.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  _isMounted = false;

  getLocation(locationObject) {
    this.setState({ location: locationObject });
  }
  _onMapReady = () => {
    console.log("map ready");
  };

  markerPressed(data) {
    console.log(data);
    this.setState({
      spotInfo: {
        price: data.price,
        info: [data.title, data.description],
        is_rented: data.is_rented,
        id: data.id,
        address: data.title,
        owner: data.owner,
      },
      location: {
        lat: data.location.latitude,
        lng: data.location.longitude
      }
    },
      function() {
        console.log("show popup");
        this.infoPopup.show();
      }
    );
  }

  writeOrderData() {
    firebase
      .database()
      .ref("orders/")
      .push({
        address: this.state.spotInfo.address,
        spot: this.state.spotInfo.id,
        owner: this.state.spotInfo.owner,
        start: Date.now(),
        renter: firebase.auth().currentUser.uid
      })
      .then(data => {
        this.setState({ currentOrder: data.key }, () => {
          this.parkingConfirmComplete();
        });
        //success callback
        console.log("data ", data);
      })
      .catch(error => {
        //error callback
        console.log("error ", error);
      });
  }

  parkButtonPressed() {
    let userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/users/${userId}`)
      .once("value", user => {
        console.log(user);
        if (!user.val().stripe_id) {
          alert("Please add a credit card to your account to rent a spot");
          return;
        }
        if (user.val().currently_renting) {
          alert("Sorry, you are already renting a spot.");
          return;
        }
        this.infoPopup.dismiss(() => {
          setTimeout(() => {
            this.confirmPopup.show();
          }, 200);
        });
      });
  }

  parkingConfirmComplete() {
    this.refs.confirmCard.resetButton();
    let currentUser = firebase.auth().currentUser;
    if (this._isMounted) {
      this.confirmPopup.dismiss();
      firebase
        .database()
        .ref(`spots/${this.state.spotInfo.id}/is_rented`)
        .set(true);
      firebase
        .database()
        .ref(`/users/${currentUser.uid}/currently_renting`)
        .set(this.state.spotInfo.id);
      firebase
        .database()
        .ref(`/users/${currentUser.uid}/current_order`)
        .set(this.state.currentOrder);
    }
  }

  statusPressed() {
    console.log("status pressed");
    this.statusPopup.show();
  }

  checkout() {
    this.refs.statusCard.resetButton();
    this.refs.currentRent.clearTimer();
    let currentUser = firebase.auth().currentUser;
    this.statusPopup.dismiss();
    firebase
      .database()
      .ref(`spots/${this.state.spotRented}/is_rented`)
      .set(false);
    firebase
      .database()
      .ref(`/users/${currentUser.uid}/currently_renting`)
      .set(null);
    firebase
      .database()
      .ref(`/users/${currentUser.uid}/current_order`)
      .set(null);
  }

  componentDidMount() {
    this._isMounted = true;

    // console.log('did mount', this._isMounted);
    if (this._isMounted) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          firebase
            .database()
            .ref(`/users/${user.uid}`)
            .on("value", data => {
              let renting = data.val().currently_renting;
              let order = data.val().current_order;
              this.setState({
                spotRented: renting,
                currentOrder: order
              });
              if (renting) {
                firebase
                  .database()
                  .ref(`/spots/${renting}`)
                  .once("value", spot => {
                    console.log(spot);
                    let price = spot.val().price;
                    let info = [spot.val().title, spot.val().description];
                    this.setState(
                      {
                        rentedSpotInfo: {
                          price: price,
                          info: info
                        }
                      },
                      () => this.refs.currentRent.startTimer()
                    );
                    // });
                  });
              }
            });
        }
      });
      firebase
        .database()
        .ref("/spots/")
        .on("value", data => {
          let spots = [];
          data.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.id = childSnapshot.key;
            spots.push(item);
            this.setState({
              markers: spots
            });
          });
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // console.log('unmount', this._isMounted);
    firebase.database().ref.off();
  }

  render() {
    const slideAnimation = new SlideAnimation({
      slideFrom: "top"
    });

    return (
      <Container>
        <HeaderNavigation navigation={this.props.navigation} />
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          <MapAutoComplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={"done"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="true" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true

              this.getLocation(details.geometry.location);
            }}
            getDefaultValue={() => ""}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_MAPS_API,
              establishment: "establishment",
              street_number: "short_name",
              route: "long_name",
              locality: "long_name",
              administrative_area_level_1: "short_name",
              country: "long_name",
              postal_code: "short_name"
            }}
            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance",
              types: "food"
            }}
            filterReverseGeocodingByTypes={[
              "locality",
              "administrative_area_level_3"
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
          <MapView
            style={styles.map}
            customMapStyle={mapStyle}
            // region={{
            //   latitude: this.state.location.lat,
            //   longitude: this.state.location.lng,
            //   latitudeDelta: 0.07,
            //   longitudeDelta: 0.07
            // }}
            initialRegion={{
              latitude: 51.0478,
              longitude: -114.0593,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1
            }}
            showsUserLocation={true}
            onPress={this.removeCard}
          >
            {this.state.markers.map(marker => {
              return (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.location.lat,
                    longitude: marker.location.lng
                  }}
                  onPress={() => this.markerPressed(marker)}
                  image={
                    marker.is_rented
                      ? marker.id === this.state.spotRented ?
                        require("../assets/RedMarker.png")  
                        : 
                        require("../assets/GrayMarker.png")
                      : 
                      require("../assets/GreenMarker.png")
                  }
                />
              );
            })}
          </MapView>

          <View style={styles.currentRental}>
            {this.state.spotRented && (
              <TouchableOpacity
                onPress={this.statusPressed}
                activeOpacity={0.6}
              >
                <CurrentRental
                  ref="currentRent"
                  order={this.state.currentOrder}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.popupContainer}>
            <PopupDialog
              ref={infoPopup => {
                this.infoPopup = infoPopup;
              }}
              dialogAnimation={slideAnimation}
              dialogStyle={styles.dialog}
            >
              <InfoCard
                info={this.state.spotInfo}
                parkButtonPressed={this.parkButtonPressed}
              />
            </PopupDialog>
            <PopupDialog
              ref={confirmPopup => {
                this.confirmPopup = confirmPopup;
              }}
              dialogAnimation={slideAnimation}
              dialogStyle={styles.dialog}
            >
              <ConfirmCard
                ref="confirmCard"
                info={this.state.spotInfo}
                parkingConfirmComplete={this.writeOrderData}
              />
            </PopupDialog>
            <PopupDialog
              ref={statusPopup => {
                this.statusPopup = statusPopup;
              }}
              dialogAnimation={slideAnimation}
              dialogStyle={styles.statusDialog}
            >
              <StatusCard
                ref="statusCard"
                info={this.state.rentedSpotInfo}
                id={this.state.currentOrder}
                checkout={this.checkout}
              />
            </PopupDialog>
          </View>
        </View>
      </Container>
    );
  }
}

export default Map;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  },
  popupContainer: {
    height: "100%",
    width: "100%"
  },
  dialog: {
    position: "absolute",
    top: "10%",
    width: "90%",
    height: "60%",
    backgroundColor: 'rgba(38, 50, 56, 0.8)',
  },
  statusDialog: {
    position: "absolute",
    top: "10%",
    width: "90%",
    height: "40%",
    backgroundColor: 'rgba(38, 50, 56, 0.8)',
  },
  currentRental: {
    position: "absolute",
    bottom: "10%"
  }
});

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#1d2c4d"
      }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8ec3b9"
      }
    ]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1a3646"
      }
    ]
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#64779e"
      }
    ]
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878"
      }
    ]
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#334e87"
      }
    ]
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#023e58"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#283d6a"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6f9ba5"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#023e58"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3C7680"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#304a7d"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c6675"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#255763"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#b0d5ce"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#023e58"
      }
    ]
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be"
      }
    ]
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d"
      }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#283d6a"
      }
    ]
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#3a4762"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#0e1626"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#4e6d70"
      }
    ]
  }
];
