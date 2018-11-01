import React from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";

import { Button } from "react-native-elements";
import { List, ListItem } from "react-native-elements";
import { Container } from "native-base";
import HeaderNavigation from "../Components/HeaderNavigation.js";

export default class Dashboard extends React.Component {
  vehicleSize(size) {
    switch (size) {
      case "small":
        return "https://png.icons8.com/dotty/40/000000/dirt-bike.png";
      case "medium":
        return "https://png.icons8.com/dotty/40/000000/fiat-500.png";
      case "large":
        return "https://png.icons8.com/dotty/40/000000/suv.png";
      default:
        return "https://png.icons8.com/dotty/40/000000/fiat-500.png";
    }
  }

  componentDidMount() {
    // console.log(firebase.apps.length);
    // console.log(firebase.auth());
  }

  render() {
    const list = [
      {
        title: "Order History",
        icon: "",
        navigate: "OrderHistory"
      },
      {
        title: "Rent History",
        icon: "",
        navigate: "RentHistory"
      },
      {
        title: "My Spots",
        icon: "",
        navigate: "MySpots"
      },
      {
        title: "Add a spot",
        icon: "",
        navigate: "AddASpot"
      },
      {
        title: "Payment Info",
        icon: "",
        navigate: "PaymentInfo"
      }
    ];

    return (
      <Container>
        <HeaderNavigation navigation={this.props.navigation} />
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.name}>
                {this.props.user.first_name} {this.props.user.last_name}
              </Text>
              <Text style={styles.userInfo}>{this.props.user.email}</Text>
              <Text style={styles.userInfo}>
                {this.props.user.phone_number}
              </Text>
              <Text style={styles.userInfo}>
                License Plate: {this.props.user.license_plate}
              </Text>
              <Image
                style={styles.avatar}
                source={{ uri: this.vehicleSize(this.props.user.car_size) }}
              />
              <Button
                // buttonStyle={styles.bottom_button}
                buttonStyle={styles.bottom_button}
                raise={true}
                title="EDIT PROFILE"
                accessibilityLabel="Change User Profile"
                onPress={() => this.props.navigation.navigate("EditProfile")}
              />
            </View>
          </View>

          <View style={styles.body}>
            <List>
              {list.map(item => (
                <ListItem
                  activeScale={0.95}
                  containerStyle={styles.listItem}
                  titleStyle={styles.listItemContent}
                  key={item.title}
                  title={item.title}
                  onPress={() => this.props.navigation.navigate(item.navigate)}
                  // leftIcon={{name: item.icon}}
                />
              ))}
            </List>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#424242"
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#2f2f2f"
  },
  avatar: {
    width: 80,
    height: 80,
    // borderRadius: 63,
    // borderWidth: 4,
    // borderColor: "white",
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    color: "#F5F5F5",
    fontWeight: "200",
    fontFamily: "sans-serif-thin"
  },
  userInfo: {
    fontSize: 16,
    color: "#F5F5F5",
    fontWeight: "100",
    fontFamily: "sans-serif-thin"
  },
  body: {
    backgroundColor: "#424242",
    height: 500
    // alignItems:'center',
  },
  item: {
    flexDirection: "row"
  },
  infoContent: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 5
  },
  iconContent: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 5
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: "#FFFFFF"
  },
  bottom_button: {
    // position: 'absolute',
    backgroundColor: "#212121",
    width: 350,
    fontFamily: "sans-serif-thin"
    // marginTop: 290,
    // bottom: 0,
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    marginTop: 65
  },
  listItem: {
    backgroundColor: "#424242"
  },
  listItemContent: {
    color: "#F5F5F5",
    fontFamily: "sans-serif-thin"
  }
});
