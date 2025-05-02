import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const FAVORITE_WIDTH = width * 0.28;

export const styles = StyleSheet.create({
  favoritesList: {
    paddingVertical: 5,
  },
  favoriteItem: {
    width: FAVORITE_WIDTH,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
    overflow: "hidden",
  },
  favoriteContent: {
    padding: 8,
    position: "relative",
    alignItems: "center",
    height: 90,
  },
  favoriteTextContainer: {
    marginTop: 6,
    alignItems: "center",
  },
  favoriteName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  favoritePrice: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2e8b57",
    marginTop: 2,
  },
  favoriteTag: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  marketTag: {
    backgroundColor: "#e6f7ff",
  },
  productTag: {
    backgroundColor: "#f6ffed",
  },
  favoriteTagText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  marketAvatar: {
    backgroundColor: "#1890ff",
  },
  productAvatar: {
    backgroundColor: "#52c41a",
  },
});