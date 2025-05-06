import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  productCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    backgroundColor: "#fff",
  },
  productContent: {
    flexDirection: "row",
    padding: 12,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 15,
  },
  productImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  productPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  favoriteButton: {
    alignSelf: "center",
    margin: 0,
  },
});